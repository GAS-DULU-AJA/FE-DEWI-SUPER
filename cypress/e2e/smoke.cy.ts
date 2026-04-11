describe("Smoke Test", () => {
  it("should load the login page", () => {
    cy.visit("/login");
    cy.contains("Admin DeWi").should("be.visible");
  });
});
