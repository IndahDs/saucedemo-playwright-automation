# SauceDemo Automation Testing with Playwright (JavaScript)

Automation testing project for [SauceDemo](https://www.saucedemo.com/) using Playwright and JavaScript following the Page Object Model (POM) pattern.

## Project Structure

```
SauceDemo Playwright/
├── pages/
│   ├── loginPage.js                  # Page Object for Login page
│   └── inventoryPage.js              # Page Object for Inventory / Catalog page
├── tests/
│   └── Login Scenarios/              # Test folder for Login Scenarios
│       └── login.spec.js             # Test script for Login scenarios (Positive & Negative)
├── scripts/
│   └── allure-helper.js              # Helper script for multi-folder Allure reports
├── package.json
├── playwright.config.js              # Playwright configuration
└── README.md
```

## Test Scenarios in `Login Scenarios`

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

## How to Run Tests

Open a terminal in the project folder:
```powershell
cd "C:\INDAH AUTOMATION\SauceDemo Playwright"
```

1. **Run all tests:**
   ```bash
   npm test
   ```

2. **Run only Login Scenarios:**
   ```bash
   npx playwright test "tests/Login Scenarios"
   ```

3. **Run tests with browser window visible (Headed mode):**
   ```bash
   npm run test:headed
   ```

4. **Run tests with interactive Playwright UI:**
   ```bash
   npm run test:ui
   ```

5. **Open Playwright HTML Report:**
   ```bash
   npm run test:report
   ```

---

## Allure Report

After running the tests (`npm test`), test results are automatically grouped into subfolders inside `allure-results/` based on the scenario name (e.g., `allure-results/Login Scenarios/`).

Every test automatically includes **screenshots** (credential inputs on the login page, error messages, and the inventory page after successful login).

1. **Generate Allure Report:**
   ```bash
   npm run allure:generate
   ```

2. **Open Allure Report in Browser:**
   ```bash
   npm run allure:open
   ```

3. **Generate and Serve Allure Report (Live Local Server):**
   ```bash
   npm run allure:serve
   ```
