class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }

  async getCartItems() {
    const count = await this.cartItems.count();
    const items = [];
    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      const name = (await item.locator('[data-test="inventory-item-name"]').textContent()).trim();
      const priceText = (await item.locator('[data-test="inventory-item-price"]').textContent()).trim();
      const price = parseFloat(priceText.replace('$', ''));
      const quantityText = (await item.locator('[data-test="item-quantity"]').textContent()).trim();
      const quantity = parseInt(quantityText, 10);
      items.push({ name, priceText, price, quantity });
    }
    return items;
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }
}

module.exports = { CartPage };
