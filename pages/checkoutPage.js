class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');

    // Step One: Information (checkout-step-one.html)
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step Two: Overview (checkout-step-two.html)
    this.overviewItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Step Three: Complete (checkout-complete.html)
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');

    // Header elements (available across pages)
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  // Step One methods
  async fillInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  // Step Two methods
  async getOverviewItems() {
    const count = await this.overviewItems.count();
    const items = [];
    for (let i = 0; i < count; i++) {
      const item = this.overviewItems.nth(i);
      const name = (await item.locator('[data-test="inventory-item-name"]').textContent()).trim();
      const priceText = (await item.locator('[data-test="inventory-item-price"]').textContent()).trim();
      const price = parseFloat(priceText.replace('$', ''));
      const quantityText = (await item.locator('[data-test="item-quantity"]').textContent()).trim();
      const quantity = parseInt(quantityText, 10);
      items.push({ name, priceText, price, quantity });
    }
    return items;
  }

  async getSubtotal() {
    const text = (await this.subtotalLabel.textContent()).trim();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax() {
    const text = (await this.taxLabel.textContent()).trim();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal() {
    const text = (await this.totalLabel.textContent()).trim();
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  // Step Three methods
  async clickBackHome() {
    await this.backHomeButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { CheckoutPage };
