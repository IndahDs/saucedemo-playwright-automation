const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const { LoginPage } = require('../../pages/loginPage');
const { InventoryPage } = require('../../pages/inventoryPage');

test.describe('SauceDemo - Skenario Login', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    await allure.epic('SauceDemo Authentication');
    await allure.feature('Login Feature');
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await test.step('Buka halaman login SauceDemo', async () => {
      await page.bringToFront();
      await loginPage.goto();
    });

    await test.step('Maksimalkan ukuran jendela browser (Maximize Window)', async () => {
      const screenSize = await page.evaluate(() => ({
        width: window.screen.availWidth,
        height: window.screen.availHeight
      }));
      await page.setViewportSize(screenSize);
    });
  });

  // Skenario 1 (Negative): Login dengan username yang tidak sesuai
  test('Skenario 1 (Negative): Login dengan username yang tidak sesuai', async ({ page }, testInfo) => {
    await allure.story('Negative Login - Invalid Username');
    await allure.severity('normal');
    await allure.description('Memverifikasi bahwa sistem menampilkan pesan error saat login dengan username yang salah.');

    await test.step('Input username salah dan password valid lalu submit', async () => {
      await loginPage.login('standard_us', 'secret_sauce');
    });

    await test.step('Validasi pesan error login muncul', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
      );
      const errorScreenshot = await page.screenshot();
      await allure.attachment('Screenshot Validasi Error Username', errorScreenshot, 'image/png');
      await testInfo.attach('Screenshot Validasi Error Username', {
        body: errorScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1500);
    });
  });

  // Skenario 2 (Negative): Login dengan password yang tidak sesuai
  test('Skenario 2 (Negative): Login dengan password yang tidak sesuai', async ({ page }, testInfo) => {
    await allure.story('Negative Login - Invalid Password');
    await allure.severity('normal');
    await allure.description('Memverifikasi bahwa sistem menampilkan pesan error saat login dengan password yang salah.');

    await test.step('Input username valid dan password salah lalu submit', async () => {
      await loginPage.login('standard_user', 'secret_sa');
    });

    await test.step('Validasi pesan error login muncul', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
      );
      const errorScreenshot = await page.screenshot();
      await allure.attachment('Screenshot Validasi Error Password', errorScreenshot, 'image/png');
      await testInfo.attach('Screenshot Validasi Error Password', {
        body: errorScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1500);
    });
  });

  // Skenario 3 (Negative): Login dengan akun yang tidak ada (bukan accepted username)
  test('Skenario 3 (Negative): Login dengan akun yang tidak ada di accepted usernames', async ({ page }, testInfo) => {
    await allure.story('Negative Login - Unregistered User');
    await allure.severity('normal');
    await allure.description('Memverifikasi bahwa sistem menolak login untuk username yang tidak terdaftar.');

    await test.step('Input akun yang tidak terdaftar lalu submit', async () => {
      await loginPage.login('unregistered_user', 'secret_sauce');
    });

    await test.step('Validasi pesan error login muncul', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
      );
      const errorScreenshot = await page.screenshot();
      await allure.attachment('Screenshot Validasi Error Unregistered User', errorScreenshot, 'image/png');
      await testInfo.attach('Screenshot Validasi Error Unregistered User', {
        body: errorScreenshot,
        contentType: 'image/png'
      });
      await page.waitForTimeout(1500);
    });
  });

  // Skenario 4 (Positive): Login dengan kredensial sesuai menggunakan 2 akun berbeda
  const acceptedUsers = ['standard_user', 'visual_user'];

  for (const username of acceptedUsers) {
    test(`Skenario 4 (Positive): Login berhasil menggunakan akun accepted "${username}"`, async ({ page }, testInfo) => {
      await allure.story(`Positive Login - Accepted User (${username})`);
      await allure.severity('critical');
      await allure.description(`Memverifikasi alur login berhasil untuk akun valid "${username}" dan halaman katalog inventaris terbuka.`);

      await test.step(`Input kredensial valid "${username}" pada login page`, async () => {
        await loginPage.fillCredentials(username, 'secret_sauce');
        const inputScreenshot = await page.screenshot();
        await allure.attachment(`Screenshot Input Kredensial Valid - ${username}`, inputScreenshot, 'image/png');
        await testInfo.attach(`Screenshot Input Kredensial Valid - ${username}`, {
          body: inputScreenshot,
          contentType: 'image/png'
        });
        await page.waitForTimeout(1000);
      });

      await test.step('Klik tombol Login', async () => {
        await loginPage.clickLogin();
      });

      await test.step('Validasi URL berpindah ke inventory.html', async () => {
        await expect(page).toHaveURL(/.*inventory.html/);
      });

      await test.step('Validasi produk Sauce Labs Backpack tampil di halaman inventaris', async () => {
        await expect(inventoryPage.backpackImage).toBeVisible();
        await expect(inventoryPage.backpackImage).toHaveAttribute('alt', 'Sauce Labs Backpack');
        const successScreenshot = await page.screenshot();
        await allure.attachment(`Screenshot Berhasil Login - ${username}`, successScreenshot, 'image/png');
        await testInfo.attach(`Screenshot Berhasil Login - ${username}`, {
          body: successScreenshot,
          contentType: 'image/png'
        });
        await page.waitForTimeout(2500);
      });
    });
  }
});
