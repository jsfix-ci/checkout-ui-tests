import { setup, visitAndClearCookies } from "../../../utils";
import {
  fillEmail,
  getSecondPurchaseEmail,
  confirmSecondPurchase,
  login
} from "../../../utils/profile-actions";
import { completePurchase, typeCVV } from "../../../utils/payment-actions";
import { testWrapper } from "../../../utils/testWrapper";
import { goToPayment } from "../../../utils/shipping-actions";
import {
  goToInvoiceAddress,
  fillInvoiceAddress
} from "../../../utils/invoice-actions";

testWrapper(account => {
  describe(`Pickup - 2P - Credit card - ${account}`, () => {
    before(() => {
      visitAndClearCookies(account);
    });

    it("start with delivery then, choosing pickup, then choosing pickup", () => {
      const email = getSecondPurchaseEmail();

      setup({ skus: ["285"], account });
      fillEmail(email);
      confirmSecondPurchase();
      goToInvoiceAddress(address);
      login(account);
      goToInvoiceAddress(address);
      goToPayment();
      typeCVV();
      completePurchase();

      cy.url({ timeout: 30000 }).should("contain", "/orderPlaced");
      cy.contains(email).should("be.visible");
      cy.contains("Gab**** God**").should("be.visible");
      cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible");
      cy.contains("Retirar").should("be.visible");
    });
  });
});
