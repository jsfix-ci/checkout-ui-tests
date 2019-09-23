import { setup, visitAndClearCookies } from "../../../utils"
import {
  fillEmail,
  getRandomEmail,
  fillProfile,
} from "../../../utils/profile-actions"
import {
  goToPayment,
  fillShippingInformation,
} from "../../../utils/shipping-actions"
import { payWithBoleto, completePurchase } from "../../../utils/payment-actions"

export default function test(account) {
  describe(`Delivery - Boleto - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it("with only delivery", () => {
      const email = getRandomEmail()

      setup({ skus: ["289"], account })
      fillEmail(email)
      fillProfile()
      fillShippingInformation(account)
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
      goToPayment()
      payWithBoleto()
      completePurchase()

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
    })
  })
}
