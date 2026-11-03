# SauceDemo Automation Testing with Playwright (JavaScript)

Proyek automation testing untuk website [SauceDemo](https://www.saucedemo.com/) menggunakan Playwright dan JavaScript dengan pola Page Object Model (POM).

## Struktur Project

```
SauceDemo Playwright/
├── pages/
│   ├── loginPage.js                  # Page Object untuk halaman Login
│   └── inventoryPage.js              # Page Object untuk halaman Inventory / Katalog
├── tests/
│   └── Skenario Login/               # Folder khusus Skenario Login
│       └── login.spec.js             # Script pengujian skenario Login (Positif & Negatif)
├── package.json
└── playwright.config.js              # Konfigurasi Playwright
```

## Skenario Pengujian di Folder `Skenario Login`

1. **Skenario 1 (Negative): Login dengan username yang tidak sesuai**
   - Username: `standard_us`
   - Password: `secret_sauce`
   - Validasi: Pesan error muncul (`Epic sadface: Username and password do not match any user in this service`).

2. **Skenario 2 (Negative): Login dengan password yang tidak sesuai**
   - Username: `standard_user`
   - Password: `secret_sa`
   - Validasi: Pesan error muncul (`Epic sadface: Username and password do not match any user in this service`).

3. **Skenario 3 (Negative): Login dengan akun yang tidak ada**
   - Username: `unregistered_user` (tidak ada di daftar accepted usernames)
   - Password: `secret_sauce`
   - Validasi: Pesan error muncul (`Epic sadface: Username and password do not match any user in this service`).

4. **Skenario 4 (Positive): Login dengan kredensial yang valid (2 Akun Berbeda)**
   - Akun 1: `standard_user` + `secret_sauce`
   - Akun 2: `visual_user` + `secret_sauce`
   - Validasi:
     - Berhasil diarahkan ke URL `/inventory.html`.
     - Objek `<img alt="Sauce Labs Backpack" class="inventory_item_img" data-test="inventory-item-sauce-labs-backpack-img">` berhasil tampil dan terverifikasi.

---

## Cara Menjalankan Test

Buka terminal di folder project:
```powershell
cd "C:\INDAH AUTOMATION\SauceDemo Playwright"
```

1. **Jalankan semua test:**
   ```bash
   npm test
   ```

2. **Hanya jalankan folder Skenario Login:**
   ```bash
   npx playwright test "tests/Skenario Login"
   ```

3. **Jalankan test dengan tampilan browser terbuka (Headed mode):**
   ```bash
   npm run test:headed
   ```

4. **Jalankan test dengan antarmuka interaktif Playwright UI:**
   ```bash
   npm run test:ui
   ```

5. **Buka Laporan Hasil Test (Playwright HTML Report):**
   ```bash
   npm run test:report
   ```

---

## Allure Report

Setelah pengujian dijalankan (`npm test`), hasil pengujian otomatis dikelompokkan ke dalam subfolder `allure-results/` sesuai skenario (misalnya: `allure-results/Skenario Login/`).

Setiap test juga otomatis menyertakan **screenshot** bukti validasi (error message atau halaman inventaris).

1. **Generate Allure Report:**
   ```bash
   npm run allure:generate
   ```

2. **Buka Allure Report di Browser:**
   ```bash
   npm run allure:open
   ```

3. **Generate dan Langsung Buka Allure Report (Serve):**
   ```bash
   npm run allure:serve
   ```
