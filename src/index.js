const cypress = require("cypress")
const FormData = require("form-data")
const cmd = require("node-cmd")
const fs = require("fs")
const axios = require("axios")
const Promise = require("bluebird")
const uuidv4 = require("uuid/v4")
const getSpecDirectories = require("../utils/specs")
const cmdGetAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
})
const monitoring = require("./monitoring")
const s3 = require("./s3")

const BASE_PATH = "./tests/"
const CONCURRENCY = process.env.DEV ? 1 : 5
const CYPRESS_CONFIG = {
  config: {
    chromeWebSecurity: false,
    blacklistHosts: ["www.googletagmanager.com"],
    pageLoadTimeout: 180000,
    viewportHeight: 660,
    viewportWidth: 1024,
    trashAssetsBeforeRuns: false,
  },
  env: {
    VTEX_ENV: process.env.VTEX_ENV,
  },
  projectId: "kobqo4",
  video: true,
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: false,
    json: true,
  },
}

const specs = getSpecDirectories({
  dir: BASE_PATH,
  basePath: BASE_PATH,
}).filter(
  spec => spec.indexOf("model") === -1 && spec.indexOf(".DS_Store") === -1
)

async function sendResults(result, spec) {
  if (!result || result.message === "Could not find Cypress test run results") {
    console.error("Could not find Cypress test run results")
    return
  }

  console.log("Uploading videos...")
  const runId = uuidv4()
  result.runs = await Promise.all(
    result.runs.map(async run => {
      try {
        if (run.stats.failures === 0) return run
        const file = fs.createReadStream(run.video)
        const data = new FormData()
        data.append("video", file)
        const {
          data: { url },
        } = await axios({
          url: `https://9nzhhs4p1f.execute-api.us-east-1.amazonaws.com/default/HorusFiles?dst=${runId}/${run.spec.name}.mp4&contentType=video/mp4`,
          method: "post",
          data,
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": process.env.HORUS_FILES_KEY,
          },
        })
        return { ...run, video: url }
      } catch (err) {
        console.error(err)
        return run
      }
    })
  )

  console.log(`Sending result to monitoring for "${spec}"`)
  await monitoring({
    config: {
      evidence: {
        expirationInSeconds: 7 * 24 * 60 * 60, // 7 days
      },
      env: process.env.VTEX_ENV,
      applicationName: "checkout-ui",
      healthcheck: {
        moduleName: "Checkout UI",
        status: result.totalFailed > 0 ? 0 : 1,
        title: spec,
      },
    },
    tests: result,
  })
}

function runCypress(spec) {
  return cypress
    .run({
      spec: `./tests${spec}`,
      ...CYPRESS_CONFIG,
    })
    .then(result => {
      sendResults(result, spec)
    })
    .catch(err => {
      console.log(err)
      return Promise.resolve()
    })
}

const run = async () => {
  try {
    console.log("Downloading fixtures...")
    await s3.downloadFixture()
    console.log("Fixtures downloaded.")

    console.log("Starting Tests...")
    Promise.map(specs, runCypress, { concurrency: CONCURRENCY })
    return
  } catch (err) {
    console.log(err.message)
  }
}

run()
