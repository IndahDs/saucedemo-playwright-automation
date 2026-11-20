# SauceDemo Automation Testing with Playwright (JavaScript)

Automation testing project for [SauceDemo](https://www.saucedemo.com/) using Playwright and JavaScript following the Page Object Model (POM) pattern.

## Project Structure

```
SauceDemo Playwright/
├── pages/
│   ├── loginPage.js                  # Page Object for Login page
│   ├── inventoryPage.js              # Page Object for Inventory & Navigation Menu
│   ├── dynamicCatalogPage.js         # Page Object for Dynamic Catalog page
│   ├── cartPage.js                   # Page Object for Shopping Cart page
│   └── checkoutPage.js               # Page Object for Checkout (Step 1, Step 2, Complete)
├── tests/
│   ├── Login Scenarios/              # Test suite for Login Scenarios (Negative & Positive)
│   │   └── login.spec.js
│   ├── Dynamic Catalog Scenarios/    # Test suite for Dynamic Catalog Navigation
│   │   └── dynamicCatalog.spec.js
│   └── Checkout Scenarios/           # Test suite for Checkout (1 item & >2 items, price & cart clearance)
│       └── checkout.spec.js
├── scripts/
│   └── allure-helper.js              # Helper script for multi-folder Allure reports
├── package.json
├── playwright.config.js              # Playwright configuration
└── README.md
```

---

## Test Suites & Scenarios

### 1. `Login Scenarios` (`tests/Login Scenarios/login.spec.js`)

1. **Scenario 1 (Negative): Login with invalid username**
   - Username: `standard_us`
   - Password: `secret_sauce`
   - Validation: Error message appears (`Epic sadface: Username and password do not match any user in this service`).

2. **Scenario 2 (Negative): Login with invalid password**
   - Username: `standard_user`
   - Password: `secret_sa`
   - Validation: Error message appears (`Epic sadface: Username and password do not match any user in this service`).

3. **Scenario 3 (Negative): Login with non-existent account**
   - Username: `unregistered_user` (not in accepted usernames list)
   - Password: `secret_sauce`
   - Validation: Error message appears (`Epic sadface: Username and password do not match any user in this service`).

4. **Scenario 4 (Positive): Login with valid credentials (2 Different Accounts)**
   - Account 1: `standard_user` + `secret_sauce`
   - Account 2: `visual_user` + `secret_sauce`
   - Validation:
     - Screenshot captured on credentials input before submission.
     - Successfully navigated to `/inventory.html`.
     - Sauce Labs Backpack image object `<img alt="Sauce Labs Backpack" class="inventory_item_img" data-test="inventory-item-sauce-labs-backpack-img">` is visible and verified.
     - Screenshot captured after successful navigation.

---

### 2. `Dynamic Catalog Scenarios` (`tests/Dynamic Catalog Scenarios/dynamicCatalog.spec.js`)

**Scenario 2: Follow-up flow from Scenario 4 to Dynamic Catalog - Spinner**
- Account: Last successfully logged-in user from Scenario 4 (`visual_user` + `secret_sauce`).
- Flow:
  1. Log in with `visual_user` and verify inventory page is displayed.
  2. Click Burger menu button (`#react-burger-menu-btn`).
  3. Click **Dynamic Catalog** sidebar link (`[data-test="dynamic-catalog-sidebar-link"]`) to expand submenu options (*Lazy Load*, *Spinner*, *Slider*).
  4. Click **Spinner** option (`[data-test="dynamic-catalog-spinner-link"]`).
  5. Validate URL navigates to `/dynamic-catalog-spinner.html` and verify the title element:
     `<span class="title" data-test="title">Dynamic Catalog - Spinner</span>`.
  6. Automated screenshots attached at each step.

---

### 3. `Checkout Scenarios` (`tests/Checkout Scenarios/checkout.spec.js`)

1. **Scenario 1: Checkout 1 item with price validation and cart clearance verification**
   - User: `standard_user` + `secret_sauce`
   - Flow & Validations:
     1. Add 1 item (`Sauce Labs Backpack` - $29.99) to cart and verify cart badge shows `1`.
     2. Open cart page and verify 1 item exists with matching name and price.
     3. Proceed to Checkout Step One, fill customer info (First Name, Last Name, Postal Code), and continue.
     4. On Checkout Step Two (Overview):
        - Validate item name and nominal price match the selected item.
        - Validate Item Total (subtotal) equals item price ($29.99).
        - Validate Tax > 0 and Total equals `Item Total + Tax`.
     5. Click **Finish** and validate order completion (`Thank you for your order!`).
     6. **Cart clearance validation:**
        - Validate shopping cart badge is hidden/removed.
        - Navigate to `/cart.html` and validate cart is completely empty (0 items).
        - Validate shopping cart badge remains hidden.
     7. Screenshots captured at every key step.

2. **Scenario 2: Checkout more than 2 items (3 items) with price validation and cart clearance verification**
   - User: `standard_user` + `secret_sauce`
   - Flow & Validations:
     1. Add 3 items to cart:
        - `Sauce Labs Backpack` ($29.99)
        - `Sauce Labs Bike Light` ($9.99)
        - `Sauce Labs Bolt T-Shirt` ($15.99)
     2. Validate cart badge updates incrementally up to `3`.
     3. Open cart page and verify all 3 items with exact names and prices.
     4. Proceed to Checkout Step One, fill customer info, and continue.
     5. On Checkout Step Two (Overview):
        - Validate each item's nominal price matches its catalog price.
        - Validate Item Total (subtotal) equals the exact sum of all 3 items ($29.99 + $9.99 + $15.99 = $55.97).
        - Validate Total equals `Item Total + Tax`.
     6. Click **Finish** and validate order completion (`Thank you for your order!`).
     7. **Cart clearance validation:**
        - Validate shopping cart badge is hidden/removed.
        - Navigate to `/cart.html` and validate cart is completely empty (0 items).
        - Validate shopping cart badge remains hidden.
     8. Screenshots captured at every key step.

---

## How to Run Tests

Open a terminal in the project folder:
```powershell
cd "xxx"
```

1. **Run all test suites:**
   ```bash
   npm test
   ```

2. **Run only Login Scenarios:**
   ```bash
   npx playwright test "tests/Login Scenarios"
   ```

3. **Run only Dynamic Catalog Scenarios:**
   ```bash
   npx playwright test "tests/Dynamic Catalog Scenarios"
   ```

4. **Run only Checkout Scenarios:**
   ```bash
   npx playwright test "tests/Checkout Scenarios"
   # or using npm script:
   npm run test:checkout
   ```

5. **Run tests with interactive Playwright UI:**
   ```bash
   npm run test:ui
   ```

6. **Open Playwright HTML Report:**
   ```bash
   npm run test:report
   ```

---

## Allure Report

After running tests (`npm test` or specific suites), test results are automatically grouped into subfolders inside `allure-results/` based on the scenario name:
- `allure-results/Login Scenarios/`
- `allure-results/Dynamic Catalog Scenarios/`
- `allure-results/Checkout Scenarios/`

Every test automatically captures and embeds **screenshots** for input, intermediate actions, and final validations into the Allure report.

1. **Generate and Open Allure Report (Live Local Server):**
   ```bash
   npm run allure:serve
   ```

2. **Generate Static Report:**
   ```bash
   npm run allure:generate
   ```

3. **Open Static Report in Browser:**
   ```bash
   npm run allure:open
   ```
