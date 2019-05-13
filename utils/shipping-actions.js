export function fillPostalCodeOmnishipping() {
  cy.wait(1000);
  cy.get("#ship-postalCode").type("22071060");
}

export function fillAddressInformation() {
  cy.get("#ship-number").type("12");
}

export function goToPayment() {
  cy.wait(1000);
  cy.get(".btn-go-to-payment").click();
}

export function chooseDeliveryOmnishipping() {
  cy.get("#shipping-option-delivery").click();
}

export function choosePickupOmnishipping() {
  cy.wait(1000);
  cy.get("#shipping-option-pickup-in-point").click();
}

export function fillShippingPreviewDelivery() {
  cy.wait(1000);
  cy.get("button#shipping-calculate-link").click();

  cy.get("#ship-postalCode").type("22071060");

  cy.get("#cart-shipping-calculate").click();
}

export function togglePickupShippingPreview() {
  cy.get(".srp-toggle__pickup").click();

  cy.wait(1000);
  cy.contains("Retirar 1 item").should("be.visible");
  cy.contains("Loja em Copacabana no Rio de Janeiro").should("be.visible");
}

export function toggleDeliveryShippingPreview() {
  cy.get(".srp-toggle__delivery").click();

  cy.wait(1000);
  cy.contains("Receber 1 item").should("be.visible");
  cy.contains("22071-060").should("be.visible");

  cy.wait(1000);
}

export function chooseDeliveryDate() {
  cy.get("#scheduled-delivery-delivery").click();
  cy.wait(1000);
  cy.get("#scheduled-delivery-delivery").click();
  cy.get("#scheduled-delivery-delivery").click();
  cy.get("#scheduled-delivery-choose-agendada", { force: true }).click();
  cy.get(".react-datepicker__day--keyboard-selected", { force: true }).click();
}

export function fillPickupAddress() {
  cy.get("#find-pickups-manualy-button").click();

  cy.get("#pkpmodal-search input").type("Praia de Botafogo, 300");

  cy.get(".pac-item")
    .first()
    .trigger("mouseover");

  cy.get(".pac-item")
    .first()
    .click();

  cy.get(".pkpmodal-points-list #retirada-na-loja-141125d").click();

  cy.get("#confirm-pickup-retirada-na-loja-141125d").click();
}
