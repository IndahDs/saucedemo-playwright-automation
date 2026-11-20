const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const { LoginPage } = require('../../pages/loginPage');
const { InventoryPage } = require('../../pages/inventoryPage');
const { CartPage } = require('../../pages/cartPage');
const { CheckoutPage } = require('../../pages/checkoutPage');

test.describe('SauceDemo - Checkout Scenarios', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    await allure.epic('SauceDemo Checkout');
    await allure.feature('Checkout Feature');
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

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

    await test.step('Login with valid credentials (standard_user)', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page).toHaveURL(/.*inventory.html/);
    });
  });

  // Scenario 1: Checkout 1 item
  test('Scenario 1: Checkout 1 item with price validation and cart clearance verification', async ({ page }, testInfo) => {
    await allure.story('Checkout 1 Item');
    await allure.severity('critical');
    await allure.description('Verify checkout flow for 1 item, validate item price, subtotal, tax, and total nominal, and verify that item is removed from cart upon successful checkout.');

    const customer = {
      firstName: 'Indah',
      lastName: 'Tester',
      postalCode: '12345'
    };

    let selectedItem;

    // Step 1: Add 1 item to cart
    await test.step('Add 1 item (Sauce Labs Backpack) to cart and validate cart badge', async () => {
      selectedItem = await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await expect(inventoryPage.cartBadge).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveText('1');

      const addScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - 1 Item Added to Cart', addScreenshot, 'image/png');
      await testInfo.attach('Screenshot - 1 Item Added to Cart', {
        body: addScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 2: Navigate to cart and verify item
    await test.step('Navigate to cart page and verify 1 item in cart', async () => {
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(cartPage.cartItems).toHaveCount(1);

      const cartItems = await cartPage.getCartItems();
      expect(cartItems[0].name).toBe(selectedItem.name);
      expect(cartItems[0].price).toBe(selectedItem.price);

      const cartScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Cart Page with 1 Item', cartScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Cart Page with 1 Item', {
        body: cartScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 3: Proceed to Checkout Step One and fill customer information
    await test.step('Click Checkout and input customer information', async () => {
      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);

      await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);

      const infoScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Checkout Information Filled', infoScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Checkout Information Filled', {
        body: infoScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);

      await checkoutPage.clickContinue();
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
    });

    // Step 4: Validate item prices, subtotal, tax, and total on Checkout Step Two (Overview)
    await test.step('Validate item nominal price, subtotal, tax, and total calculation', async () => {
      // Validate item in overview
      await expect(checkoutPage.overviewItems).toHaveCount(1);
      const overviewItems = await checkoutPage.getOverviewItems();
      expect(overviewItems[0].name).toBe(selectedItem.name);
      expect(overviewItems[0].price).toBe(selectedItem.price);

      // Validate subtotal
      const uiSubtotal = await checkoutPage.getSubtotal();
      const expectedSubtotal = selectedItem.price;
      expect(uiSubtotal).toBeCloseTo(expectedSubtotal, 2);

      // Validate tax and total
      const uiTax = await checkoutPage.getTax();
      expect(uiTax).toBeGreaterThan(0);

      const uiTotal = await checkoutPage.getTotal();
      const expectedTotal = uiSubtotal + uiTax;
      expect(uiTotal).toBeCloseTo(expectedTotal, 2);

      const overviewScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Checkout Overview Price Validation (1 Item)', overviewScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Checkout Overview Price Validation (1 Item)', {
        body: overviewScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 5: Finish checkout
    await test.step('Click Finish button and validate order completion', async () => {
      await checkoutPage.clickFinish();
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(checkoutPage.completeHeader).toBeVisible();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');

      const completeScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Checkout Complete (1 Item)', completeScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Checkout Complete (1 Item)', {
        body: completeScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 6: Validate items are cleared from cart after successful checkout
    await test.step('Validate cart badge disappears and cart is empty after successful checkout', async () => {
      // 1. Validate shopping cart badge is no longer visible
      await expect(checkoutPage.cartBadge).toBeHidden();

      // 2. Click shopping cart link to inspect cart page
      await checkoutPage.goToCart();
      await expect(page).toHaveURL(/.*cart.html/);

      // 3. Validate 0 items remain in cart
      await expect(cartPage.cartItems).toHaveCount(0);
      await expect(cartPage.cartBadge).toBeHidden();

      const emptyCartScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Empty Cart After Successful Checkout (1 Item)', emptyCartScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Empty Cart After Successful Checkout (1 Item)', {
        body: emptyCartScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(2000);
    });
  });

  // Scenario 2: Checkout more than 2 items (> 2 items, e.g. 3 items)
  test('Scenario 2: Checkout more than 2 items (3 items) with price validation and cart clearance verification', async ({ page }, testInfo) => {
    await allure.story('Checkout Multiple Items (>2 Items)');
    await allure.severity('critical');
    await allure.description('Verify checkout flow for more than 2 items (3 items), validate each item price, combined subtotal, tax, and total nominal, and verify that all items are removed from cart upon successful checkout.');

    const customer = {
      firstName: 'Indah',
      lastName: 'Tester',
      postalCode: '67890'
    };

    const targetItemNames = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt'
    ];

    const addedItems = [];

    // Step 1: Add more than 2 items (3 items) to cart
    await test.step('Add 3 items to cart and validate cart badge updates to 3', async () => {
      for (let i = 0; i < targetItemNames.length; i++) {
        const itemInfo = await inventoryPage.addItemToCartByName(targetItemNames[i]);
        addedItems.push(itemInfo);
        await expect(inventoryPage.cartBadge).toHaveText(String(i + 1));
      }

      expect(addedItems).toHaveLength(3);

      const addScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - 3 Items Added to Cart', addScreenshot, 'image/png');
      await testInfo.attach('Screenshot - 3 Items Added to Cart', {
        body: addScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 2: Navigate to cart and verify all 3 items
    await test.step('Navigate to cart page and verify 3 items in cart', async () => {
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/.*cart.html/);
      await expect(cartPage.cartItems).toHaveCount(3);

      const cartItems = await cartPage.getCartItems();
      for (let i = 0; i < addedItems.length; i++) {
        expect(cartItems[i].name).toBe(addedItems[i].name);
        expect(cartItems[i].price).toBe(addedItems[i].price);
      }

      const cartScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Cart Page with 3 Items', cartScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Cart Page with 3 Items', {
        body: cartScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 3: Proceed to Checkout Step One and fill customer information
    await test.step('Click Checkout and input customer information', async () => {
      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);

      await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);

      const infoScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Checkout Information Filled (3 Items)', infoScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Checkout Information Filled (3 Items)', {
        body: infoScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);

      await checkoutPage.clickContinue();
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
    });

    // Step 4: Validate item prices, subtotal sum, tax, and total on Checkout Step Two (Overview)
    await test.step('Validate all 3 items nominal price, subtotal sum, tax, and total calculation', async () => {
      await expect(checkoutPage.overviewItems).toHaveCount(3);
      const overviewItems = await checkoutPage.getOverviewItems();

      let calculatedSubtotal = 0;
      for (let i = 0; i < addedItems.length; i++) {
        expect(overviewItems[i].name).toBe(addedItems[i].name);
        expect(overviewItems[i].price).toBe(addedItems[i].price);
        calculatedSubtotal += overviewItems[i].price;
      }

      // Validate UI Subtotal equals the exact sum of all 3 items
      const uiSubtotal = await checkoutPage.getSubtotal();
      expect(uiSubtotal).toBeCloseTo(calculatedSubtotal, 2);

      // Validate tax and total
      const uiTax = await checkoutPage.getTax();
      expect(uiTax).toBeGreaterThan(0);

      const uiTotal = await checkoutPage.getTotal();
      const expectedTotal = uiSubtotal + uiTax;
      expect(uiTotal).toBeCloseTo(expectedTotal, 2);

      const overviewScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Checkout Overview Price Validation (3 Items)', overviewScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Checkout Overview Price Validation (3 Items)', {
        body: overviewScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 5: Finish checkout
    await test.step('Click Finish button and validate order completion', async () => {
      await checkoutPage.clickFinish();
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(checkoutPage.completeHeader).toBeVisible();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');

      const completeScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Checkout Complete (3 Items)', completeScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Checkout Complete (3 Items)', {
        body: completeScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1000);
    });

    // Step 6: Validate items are cleared from cart after successful checkout
    await test.step('Validate cart badge disappears and cart is empty after successful checkout', async () => {
      // 1. Validate shopping cart badge is no longer visible
      await expect(checkoutPage.cartBadge).toBeHidden();

      // 2. Click shopping cart link to inspect cart page
      await checkoutPage.goToCart();
      await expect(page).toHaveURL(/.*cart.html/);

      // 3. Validate 0 items remain in cart
      await expect(cartPage.cartItems).toHaveCount(0);
      await expect(cartPage.cartBadge).toBeHidden();

      const emptyCartScreenshot = await page.screenshot();
      await allure.attachment('Screenshot - Empty Cart After Successful Checkout (3 Items)', emptyCartScreenshot, 'image/png');
      await testInfo.attach('Screenshot - Empty Cart After Successful Checkout (3 Items)', {
        body: emptyCartScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(2000);
    });
  });
});
