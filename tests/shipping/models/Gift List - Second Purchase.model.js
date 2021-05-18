import { setup, visitAndClearCookies } from '../../../utils'
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
} from '../../../utils/profile-actions'
import { payWithBoleto, completePurchase } from '../../../utils/payment-actions'
import { SKUS } from '../../../utils/constants'

export default function test(account) {
  describe(`Gift List - Second Purchase - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account)
    })

    it('gift list with delivery', () => {
      const email = getSecondPurchaseEmail()

      setup({
        mobile: false,
        isGiftList: true,
        skus: [SKUS.DELIVERY_CUSTOMIZATION_ATTACHMENT],
        account,
      })
      fillEmail(email)
      confirmSecondPurchase()
      payWithBoleto()
      completePurchase()

      cy.url({ timeout: 120000 }).should('contain', '/orderPlaced')
      cy.wait(2000)
      cy.contains(email).should('be.visible')
      cy.contains('Sec*** Pur*****').should('be.visible')
      cy.contains('Teste Endereço').should('be.visible')
    })
  })
}
