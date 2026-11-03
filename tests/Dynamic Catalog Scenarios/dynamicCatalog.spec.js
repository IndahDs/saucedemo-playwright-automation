const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const { LoginPage } = require('../../pages/loginPage');
const { InventoryPage } = require('../../pages/inventoryPage');
const { DynamicCatalogPage } = require('../../pages/dynamicCatalogPage');

test.describe('SauceDemo - Dynamic Catalog Scenarios', () => {
  let loginPage;
  let inventoryPage;
  let dynamicCatalogPage;

  test.beforeEach(async ({ page }) => {
    await allure.epic('SauceDemo Catalog & Navigation');
    await allure.feature('Dynamic Catalog Feature');
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    dynamicCatalogPage = new DynamicCatalogPage(page);

    await test.step('Open SauceDemo login page', async () => {
      await page.bringToFront();
      await loginPage.goto();
    });

    await test.step('Maximize browser window', async () => {
      const screenSize = await page.evaluate(() => ({
        width: window.screen.availWidth,
        height: window.screen.availHeight
      }));
      await page.setViewportSize(screenSize);
    });
  });

  test('Scenario 2: Follow-up from Scenario 4 - Navigate to Dynamic Catalog Spinner using last logged-in user', async ({ page }, testInfo) => {
    await allure.story('Navigate to Dynamic Catalog - Spinner via Burger Menu');
    await allure.severity('critical');
    await allure.description('Follow-up flow from Scenario 4: Log in using the last accepted user (visual_user), open the burger menu, expand Dynamic Catalog, click Spinner, and validate the page title "Dynamic Catalog - Spinner".');

    const lastUser = 'visual_user';
    const password = 'secret_sauce';

    // Step 1: Login using the last successful user from Scenario 4
    await test.step(`Input valid credentials for "${lastUser}" on login page`, async () => {
      await loginPage.fillCredentials(lastUser, password);
      const inputScreenshot = await page.screenshot();
      await allure.attachment(`Screenshot - Valid Credentials Input (${lastUser})`, inputScreenshot, 'image/png');
      await testInfo.attach(`Screenshot - Valid Credentials Input (${lastUser})`, {
        body: inputScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    await test.step('Click Login button', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Validate successful navigation to inventory page', async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(inventoryPage.backpackImage).toBeVisible();
      const loginSuccessScreenshot = await page.screenshot();
      await allure.attachment(`Screenshot - Inventory Page (${lastUser})`, loginSuccessScreenshot, 'image/png');
      await testInfo.attach(`Screenshot - Inventory Page (${lastUser})`, {
        body: loginSuccessScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 2: Open Burger Menu
    await test.step('Click burger menu button (Open Menu)', async () => {
      await inventoryPage.openBurgerMenu();
      await expect(inventoryPage.dynamicCatalogSidebarLink).toBeVisible();
      const menuScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Burger Menu Opened', menuScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Burger Menu Opened', {
        body: menuScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 3: Click Dynamic Catalog to expand submenu
    await test.step('Click Dynamic Catalog to expand options (Lazy Load, Spinner, Slider)', async () => {
      await inventoryPage.clickDynamicCatalog();
      await expect(inventoryPage.spinnerSidebarLink).toBeVisible();
      const submenuScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Dynamic Catalog Submenu Expanded', submenuScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Dynamic Catalog Submenu Expanded', {
        body: submenuScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 4: Click Spinner link
    await test.step('Click Spinner option', async () => {
      await inventoryPage.clickSpinner();
    });

    // Step 5: Validate Dynamic Catalog - Spinner page
    await test.step('Validate navigation and title object: Dynamic Catalog - Spinner', async () => {
      // Validate URL
      await expect(page).toHaveURL(/.*dynamic-catalog-spinner.html/);

      // Validate title element: <span class="title" data-test="title">Dynamic Catalog - Spinner</span>
      await expect(dynamicCatalogPage.title).toBeVisible();
      await expect(dynamicCatalogPage.title).toHaveText('Dynamic Catalog - Spinner');

      const validatedScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Dynamic Catalog Spinner Validated', validatedScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Dynamic Catalog Spinner Validated', {
        body: validatedScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(2500);
    });
  });
});
