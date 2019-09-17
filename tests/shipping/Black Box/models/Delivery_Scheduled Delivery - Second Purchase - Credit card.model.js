import { setup, visitAndClearCookies } from "../../../../utils"
import {
  fillEmail,
  confirmSecondPurchase,
  getSecondPurchaseEmail,
} from "../../../../utils/profile-actions"
import {
  goToPayment,
  chooseDeliveryDate,
} from "../../../../utils/shipping-actions"
import { completePurchase, typeCVV } from "../../../../utils/payment-actions"

export default function test(account) {
  describe(`Delivery + Scheduled Delivery - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("delivery with scheduled delivery with multiple items", () => {
      const email = getSecondPurchaseEmail()

      setup({ skus: ["35", "299"], account })
      fillEmail(email)
      confirmSecondPurchase()
      chooseDeliveryDate()
      goToPayment()
      typeCVV()
      completePurchase()

      cy.url({ timeout: 120000 }).should("contain", "/orderPlaced")
      cy.wait(2000)
      cy.contains(email).should("be.visible")
      cy.contains("Gab**** God**").should("be.visible")
      cy.contains("Receber").should("be.visible")
      cy.contains("Bot*****").should("be.visible")
    })
  })
}
