# How to contribute

To to contribute with this repository, you should go to our [`SCENARIOS`](https://github.com/vtex/checkout-ui-tests/blob/master/SCENARIOS.md) file and check the scenarios which we still need to cover, as well as read how to implement a e2e test.

## Creating model and test files

Once you chose the scenario you want to cover at [`SCENARIOS`](https://github.com/vtex/checkout-ui-tests/blob/master/SCENARIOS.md), you should create a `TITLE - SCENARIO - PAYMENT METHOD.model.js` in the `tests/` folder.

Let's say you chose `Delivery (Payment: Boleto) - Recurring Purchase`, since it's a `Shipping` scenario you will create a file in the `shipping` folder called `Delivery - Recurring Purchase - Boleto.model.js`.

Once you have created the `.model.js` file you will run the following command to generate the `.test.js` files:

```sh
$ yarn compile
```

This command generates 5 test files, as a result of each scenario needs to run in 5 different accounts with multiple configurations between them. Their configuration is as follows:

|                 | `vtexgame1` | `vtexgame1geo` | `vtexgame1nolean` | `vtexgame1clean` | `vtexgame1invoice` |
| --------------- | ----------- | -------------- | ----------------- | ---------------- | ------------------ |
| Lean Shipping   | true        | true           | false             | false            | true               |
| Geolocation     | false       | true           | false             | false            | false              |
| Google Maps Key | YES         | YES            | NO                | NO               | NO                 |
| Invoice Address | false       | false          | false             | false            | true               |

## Implementing a scenario

Once you created a model file you should export a test function which receives an `account` as a parameter for the test to be able to run in different account. The code should be like this:

```js
export default function test(account) {
  // test code goes here
}
```

After implementing the test function you should implement the test itself simulating a purchase and asserting the results. Every scenario should be have it's own file with one describe and one it for the context not to reflect on other tests. Also, every test must implement the `before()` calling `visitAndClearCookies(account)` to clean cookies and set the `beta` cookie if necessary. The initial describe should be as follows:

```js
...
describe(`Delivery - Recurring Purchase - Boleto - ${account}`, () => {
  before(() => {
    visitAndClearCookies(account)
  })

  it("should finish a purchase", () => {
    // simulate the purchase
  })
})
...
```

Since we are creating a recurring customer scenario, you will start the purchase flow by getting the recurring email, otherwise just import `getRandomEmail` to get an email for :

```js
import { getSecondPurchaseEmail } from "../../../utils/profile-actions"

it("should finish a purchase", () => {
  const email = getSecondPurchaseEmail()
  ...
})
```

After that you should implement call `setup()` function passing the skus and the account we received as a parameter, for cypress to add items to cart

```js
import { setup } from "../../../utils"

...

export default function test(account) {

...

  const skus = ["289"]
  setup({ skus, account })

...
}
```

Once the `setup` is implemented, the steps to finish a purchase is next. In the `utils` folder you have at your disposal a series of implemented actions for each step of the checkout process. To check the available actions go to the readme and it's described there. After actions are implemented you should assert if the information selected was right, so in our example, we should assert if the shipping information matches what was selected at the shipping step and after the purchase is completed check if the information matches as well:

```js

// checking if depending on the account configuration
// it should show the right information
...
if (account === "noLean") {
  cy.get("#shipping-data")
    .contains("PAC")
    .should("be.visible")
  cy.get("#shipping-data")
    .contains("Motoboy")
    .should("be.visible")
  cy.get("#shipping-data")
    .contains("Expressa")
    .should("be.visible")
  cy.get("#shipping-data")
    .contains("PAC Lento")
    .should("be.visible")
} else {
  cy.get("#shipping-data")
    .contains("Mais rápida")
    .should("be.visible")
  cy.get("#shipping-data")
    .contains("Mais econômica")
    .should("be.visible")
}
...
//  Also, after the order is placed check if the information matches what
// was provided in earlier steps
cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
cy.wait(2000)
cy.contains(email).should("be.visible")
cy.contains("Fernando Coelho").should("be.visible")
cy.contains("5521999999999").should("be.visible")
cy.contains("Boleto bancário").should("be.visible")
cy.contains("Receber").should("be.visible")
cy.contains("Rua Saint Roman 12").should("be.visible")
cy.contains("Copacabana").should("be.visible")
cy.contains("PAC").should("be.visible")
...
```

After the test is done you should update [`SCENARIOS`](https://github.com/vtex/checkout-ui-tests/blob/master/SCENARIOS.md) and [`CHANGELOG`](https://github.com/vtex/checkout-ui-tests/blob/master/CHANGELOG.md) adding the implemented scenario. Also if an new action is implemented you should add it to the `README` as well.
