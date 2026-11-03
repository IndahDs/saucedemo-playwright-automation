class DynamicCatalogPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
  }

  async getTitleText() {
    return await this.title.textContent();
  }

  async isTitleVisible() {
    return await this.title.isVisible();
  }
}

module.exports = { DynamicCatalogPage };
