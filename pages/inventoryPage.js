class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.backpackImage = page.locator('img[data-test="inventory-item-sauce-labs-backpack-img"]');
    this.title = page.locator('[data-test="title"]');
  }

  async isBackpackImageVisible() {
    return await this.backpackImage.isVisible();
  }
}

module.exports = { InventoryPage };
