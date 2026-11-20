class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.backpackImage = page.locator('img[data-test="inventory-item-sauce-labs-backpack-img"]');
    this.title = page.locator('[data-test="title"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.dynamicCatalogSidebarLink = page.locator('[data-test="dynamic-catalog-sidebar-link"]');
    this.lazyLoadSidebarLink = page.locator('[data-test="dynamic-catalog-lazy-load-link"]');
    this.spinnerSidebarLink = page.locator('[data-test="dynamic-catalog-spinner-link"]');
    this.sliderSidebarLink = page.locator('[data-test="dynamic-catalog-slider-link"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
  }

  async isBackpackImageVisible() {
    return await this.backpackImage.isVisible();
  }

  async openBurgerMenu() {
    await this.burgerMenuButton.click();
  }

  async clickDynamicCatalog() {
    await this.dynamicCatalogSidebarLink.click();
  }

  async clickSpinner() {
    await this.spinnerSidebarLink.click();
  }

  async clickLazyLoad() {
    await this.lazyLoadSidebarLink.click();
  }

  async clickSlider() {
    await this.sliderSidebarLink.click();
  }

  async addItemToCartByIndex(index) {
    const item = this.inventoryItems.nth(index);
    const name = (await item.locator('[data-test="inventory-item-name"]').textContent()).trim();
    const priceText = (await item.locator('[data-test="inventory-item-price"]').textContent()).trim();
    const price = parseFloat(priceText.replace('$', ''));
    await item.locator('button').click();
    return { name, priceText, price };
  }

  async addItemToCartByName(name) {
    const item = this.inventoryItems.filter({ hasText: name });
    const priceText = (await item.locator('[data-test="inventory-item-price"]').textContent()).trim();
    const price = parseFloat(priceText.replace('$', ''));
    await item.locator('button').click();
    return { name, priceText, price };
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getCartBadgeCount() {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.textContent(), 10);
    }
    return 0;
  }
}

module.exports = { InventoryPage };
