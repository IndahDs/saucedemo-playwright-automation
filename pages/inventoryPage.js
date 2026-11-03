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
}

module.exports = { InventoryPage };
