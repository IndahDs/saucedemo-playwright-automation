const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const { LoginPage } = require('../../pages/loginPage');
const { InventoryPage } = require('../../pages/inventoryPage');

test.describe('SauceDemo - Login Scenarios', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    await allure.epic('SauceDemo Authentication');
    await allure.feature('Login Feature');
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

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

  // Scenario 1 (Negative): Login with invalid username
  test('Scenario 1 (Negative): Login with invalid username', async ({ page }, testInfo) => {
    await allure.story('Negative Login - Invalid Username');
    await allure.severity('normal');
    await allure.description('Verify that the system displays an error message when logging in with an invalid username.');

    await test.step('Input invalid username and valid password then submit', async () => {
      await loginPage.login('standard_us', 'secret_sauce');
    });

    await test.step('Validate login error message is displayed', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
      );
      const errorScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Invalid Username Error Validation', errorScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Invalid Username Error Validation', {
        body: errorScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1500);
    });
  });

  // Scenario 2 (Negative): Login with invalid password
  test('Scenario 2 (Negative): Login with invalid password', async ({ page }, testInfo) => {
    await allure.story('Negative Login - Invalid Password');
    await allure.severity('normal');
    await allure.description('Verify that the system displays an error message when logging in with an invalid password.');

    await test.step('Input valid username and invalid password then submit', async () => {
      await loginPage.login('standard_user', 'secret_sa');
    });

    await test.step('Validate login error message is displayed', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
      );
      const errorScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Invalid Password Error Validation', errorScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Invalid Password Error Validation', {
        body: errorScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1500);
    });
  });

  // Scenario 3 (Negative): Login with non-existent account (unregistered username)
  test('Scenario 3 (Negative): Login with non-existent account (unregistered username)', async ({ page }, testInfo) => {
    await allure.story('Negative Login - Unregistered User');
    await allure.severity('normal');
    await allure.description('Verify that the system rejects login for an unregistered username.');

    await test.step('Input unregistered account credentials then submit', async () => {
      await loginPage.login('unregistered_user', 'secret_sauce');
    });

    await test.step('Validate login error message is displayed', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
      );
      const errorScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Unregistered User Error Validation', errorScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Unregistered User Error Validation', {
        body: errorScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1500);
    });
  });

  // Scenario 4 (Positive): Login with valid credentials using 2 different accounts
  const acceptedUsers = ['standard_user', 'visual_user'];

  for (const username of acceptedUsers) {
    test(`Scenario 4 (Positive): Successful login using accepted account "${username}"`, async ({ page }, testInfo) => {
      await allure.story(`Positive Login - Accepted User (${username})`);
      await allure.severity('critical');
      await allure.description(`Verify successful login flow for valid account "${username}" and verify inventory catalog page is loaded.`);

      await test.step(`Input valid credentials for "${username}" on login page`, async () => {
        await loginPage.fillCredentials(username, 'secret_sauce');
        const inputScreenshot = await page.screenshot();
        await allure.attachment(`Screenshot - Valid Credentials Input (${username})`, inputScreenshot, 'image/png');
        await testInfo.attach(`Screenshot - Valid Credentials Input (${username})`, {
          body: inputScreenshot,
          contentType: 'image/png'
        });
        await page.waitForTimeout(1000);
      });

      await test.step('Click Login button', async () => {
        await loginPage.clickLogin();
      });

      await test.step('Validate URL navigates to inventory.html', async () => {
        await expect(page).toHaveURL(/.*inventory.html/);
      });

      await test.step('Validate Sauce Labs Backpack item is displayed on inventory page', async () => {
        await expect(inventoryPage.backpackImage).toBeVisible();
        await expect(inventoryPage.backpackImage).toHaveAttribute('alt', 'Sauce Labs Backpack');
        const successScreenshot = await page.screenshot();
        await allure.attachment(`Screenshot - Successful Login (${username})`, successScreenshot, 'image/png');
        await testInfo.attach(`Screenshot - Successful Login (${username})`, {
          body: successScreenshot,
          contentType: 'image/png'
        });
        await page.waitForTimeout(2500);
      });
    });
  }
});
