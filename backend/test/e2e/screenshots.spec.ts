import { test, expect } from '@playwright/test';

// Screenshot tests for user manual documentation
// Run with: npx playwright test e2e/screenshots.spec.ts
// Screenshots saved to: docs/screenshots/

const SCREENSHOT_DIR = 'docs/screenshots';

// Baris 10 digunakan untuk: Mengelompokkan skenario pengujian tentang "User Manual Screenshots - Admin Settings"
test.describe('User Manual Screenshots - Admin Settings', () => {
  // Baris 12 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Login as admin
    // Baris 16 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Authentication
  // Baris 22 digunakan untuk: Memulai eksekusi pengujian dengan judul "01 - Login Page"
  test('01 - Login Page', async ({ page }) => {
    await page.context().clearCookies();
    // Baris 25 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/login"
    await page.goto('/admin/login');
    // Baris 27 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Masuk dengan Google')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-login.png`, fullPage: true });
  });

  // Dashboard (mockup - no specific test ID)
  // Baris 33 digunakan untuk: Memulai eksekusi pengujian dengan judul "02 - Admin Dashboard"
  test('02 - Admin Dashboard', async ({ page }) => {
    // Baris 35 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');
    // Baris 37 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Total Kandidat')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-dashboard.png`, fullPage: true });
  });

  // Settings - Users
  // Baris 43 digunakan untuk: Memulai eksekusi pengujian dengan judul "03 - Settings Users"
  test('03 - Settings Users', async ({ page }) => {
    // Baris 45 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/users"
    await page.goto('/admin/settings/users');
    // Baris 47 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-users-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-settings-users.png`, fullPage: true });
  });

  // Settings - Programs
  // Baris 53 digunakan untuk: Memulai eksekusi pengujian dengan judul "04 - Settings Programs"
  test('04 - Settings Programs', async ({ page }) => {
    // Baris 55 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/programs"
    await page.goto('/admin/settings/programs');
    // Baris 57 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-programs-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-settings-programs.png`, fullPage: true });
  });

  // Baris 62 digunakan untuk: Memulai eksekusi pengujian dengan judul "04a - Settings Programs - Add Modal"
  test('04a - Settings Programs - Add Modal', async ({ page }) => {
    // Baris 64 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/programs"
    await page.goto('/admin/settings/programs');
    // Baris 66 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-programs-page')).toBeVisible();
    // Baris 68 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-program-button').click();
    // Baris 70 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-program-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04a-settings-programs-add.png`, fullPage: true });
  });

  // Settings - Fees
  // Baris 76 digunakan untuk: Memulai eksekusi pengujian dengan judul "05 - Settings Fees"
  test('05 - Settings Fees', async ({ page }) => {
    // Baris 78 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/fees"
    await page.goto('/admin/settings/fees');
    // Baris 80 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-fees-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-settings-fees.png`, fullPage: true });
  });

  // Baris 85 digunakan untuk: Memulai eksekusi pengujian dengan judul "05a - Settings Fees - Add Modal"
  test('05a - Settings Fees - Add Modal', async ({ page }) => {
    // Baris 87 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/fees"
    await page.goto('/admin/settings/fees');
    // Baris 89 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-fees-page')).toBeVisible();
    // Baris 91 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-fee-button').click();
    // Baris 93 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-fee-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05a-settings-fees-add.png`, fullPage: true });
  });

  // Settings - Categories & Obstacles
  // Baris 99 digunakan untuk: Memulai eksekusi pengujian dengan judul "06 - Settings Categories"
  test('06 - Settings Categories', async ({ page }) => {
    // Baris 101 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/categories"
    await page.goto('/admin/settings/categories');
    // Baris 103 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-categories-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-settings-categories.png`, fullPage: true });
  });

  // Baris 108 digunakan untuk: Memulai eksekusi pengujian dengan judul "06a - Settings Categories - Add Category Modal"
  test('06a - Settings Categories - Add Category Modal', async ({ page }) => {
    // Baris 110 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/categories"
    await page.goto('/admin/settings/categories');
    // Baris 112 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-categories-page')).toBeVisible();
    // Baris 114 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-category-button').click();
    // Baris 116 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-category-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06a-settings-categories-add.png`, fullPage: true });
  });

  // Baris 121 digunakan untuk: Memulai eksekusi pengujian dengan judul "06b - Settings Categories - Add Obstacle Modal"
  test('06b - Settings Categories - Add Obstacle Modal', async ({ page }) => {
    // Baris 123 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/categories"
    await page.goto('/admin/settings/categories');
    // Baris 125 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-categories-page')).toBeVisible();
    // Baris 127 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-obstacle-button').click();
    // Baris 129 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-obstacle-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06b-settings-obstacles-add.png`, fullPage: true });
  });

  // Settings - Campaigns
  // Baris 135 digunakan untuk: Memulai eksekusi pengujian dengan judul "07 - Settings Campaigns"
  test('07 - Settings Campaigns', async ({ page }) => {
    // Baris 137 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/campaigns"
    await page.goto('/admin/settings/campaigns');
    // Baris 139 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-campaigns-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-settings-campaigns.png`, fullPage: true });
  });

  // Baris 144 digunakan untuk: Memulai eksekusi pengujian dengan judul "07a - Settings Campaigns - Add Modal"
  test('07a - Settings Campaigns - Add Modal', async ({ page }) => {
    // Baris 146 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/campaigns"
    await page.goto('/admin/settings/campaigns');
    // Baris 148 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-campaigns-page')).toBeVisible();
    // Baris 150 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-campaign-button').click();
    // Baris 152 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-campaign-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07a-settings-campaigns-add.png`, fullPage: true });
  });

  // Settings - Rewards
  // Baris 158 digunakan untuk: Memulai eksekusi pengujian dengan judul "08 - Settings Rewards"
  test('08 - Settings Rewards', async ({ page }) => {
    // Baris 160 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/rewards"
    await page.goto('/admin/settings/rewards');
    // Baris 162 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-rewards-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08-settings-rewards.png`, fullPage: true });
  });

  // Baris 167 digunakan untuk: Memulai eksekusi pengujian dengan judul "08a - Settings Rewards - Add Reward Modal"
  test('08a - Settings Rewards - Add Reward Modal', async ({ page }) => {
    // Baris 169 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/rewards"
    await page.goto('/admin/settings/rewards');
    // Baris 171 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-rewards-page')).toBeVisible();
    // Baris 173 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-reward-button').click();
    // Baris 175 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-reward-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08a-settings-rewards-add.png`, fullPage: true });
  });

  // Baris 180 digunakan untuk: Memulai eksekusi pengujian dengan judul "08b - Settings Rewards - Add MGM Modal"
  test('08b - Settings Rewards - Add MGM Modal', async ({ page }) => {
    // Baris 182 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/rewards"
    await page.goto('/admin/settings/rewards');
    // Baris 184 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-rewards-page')).toBeVisible();
    // Baris 186 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-mgm-reward-button').click();
    // Baris 188 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-mgm-reward-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08b-settings-mgm-add.png`, fullPage: true });
  });

  // Settings - Referrers
  // Baris 194 digunakan untuk: Memulai eksekusi pengujian dengan judul "09 - Settings Referrers"
  test('09 - Settings Referrers', async ({ page }) => {
    // Baris 196 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/referrers"
    await page.goto('/admin/settings/referrers');
    // Baris 198 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-referrers-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-settings-referrers.png`, fullPage: true });
  });

  // Baris 203 digunakan untuk: Memulai eksekusi pengujian dengan judul "09a - Settings Referrers - Add Modal"
  test('09a - Settings Referrers - Add Modal', async ({ page }) => {
    // Baris 205 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/referrers"
    await page.goto('/admin/settings/referrers');
    // Baris 207 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-referrers-page')).toBeVisible();
    // Baris 209 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-referrer-button').click();
    // Baris 211 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-referrer-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09a-settings-referrers-add.png`, fullPage: true });
  });

  // Settings - Assignment Algorithm
  // Baris 217 digunakan untuk: Memulai eksekusi pengujian dengan judul "10 - Settings Assignment"
  test('10 - Settings Assignment', async ({ page }) => {
    // Baris 219 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/assignment"
    await page.goto('/admin/settings/assignment');
    // Baris 221 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-assignment-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/10-settings-assignment.png`, fullPage: true });
  });

  // Settings - Document Types
  // Baris 227 digunakan untuk: Memulai eksekusi pengujian dengan judul "11 - Settings Document Types"
  test('11 - Settings Document Types', async ({ page }) => {
    // Baris 229 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/document-types"
    await page.goto('/admin/settings/document-types');
    // Baris 231 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-documents-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/11-settings-document-types.png`, fullPage: true });
  });

  // Baris 236 digunakan untuk: Memulai eksekusi pengujian dengan judul "11a - Settings Document Types - Add Modal"
  test('11a - Settings Document Types - Add Modal', async ({ page }) => {
    // Baris 238 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/document-types"
    await page.goto('/admin/settings/document-types');
    // Baris 240 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-documents-page')).toBeVisible();
    // Baris 242 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-document-type-button').click();
    // Baris 244 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-document-type-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/11a-settings-document-types-add.png`, fullPage: true });
  });

  // Settings - Lost Reasons
  // Baris 250 digunakan untuk: Memulai eksekusi pengujian dengan judul "12 - Settings Lost Reasons"
  test('12 - Settings Lost Reasons', async ({ page }) => {
    // Baris 252 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/lost-reasons"
    await page.goto('/admin/settings/lost-reasons');
    // Baris 254 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-lost-reasons-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/12-settings-lost-reasons.png`, fullPage: true });
  });

  // Baris 259 digunakan untuk: Memulai eksekusi pengujian dengan judul "12a - Settings Lost Reasons - Add Modal"
  test('12a - Settings Lost Reasons - Add Modal', async ({ page }) => {
    // Baris 261 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/lost-reasons"
    await page.goto('/admin/settings/lost-reasons');
    // Baris 263 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-lost-reasons-page')).toBeVisible();
    // Baris 265 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-lost-reason-button').click();
    // Baris 267 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-lost-reason-modal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/12a-settings-lost-reasons-add.png`, fullPage: true });
  });
});

// Generate unique identifiers for test data
function generateUniqueEmail(): string {
  const timestamp = Date.now();
  return `screenshot${timestamp}@example.com`;
}

// Baris 279 digunakan untuk: Mengelompokkan skenario pengujian tentang "User Manual Screenshots - Candidate Registration"
test.describe('User Manual Screenshots - Candidate Registration', () => {
  // Baris 281 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  // Registration Step 1 - Account Creation (Empty)
  // Baris 287 digunakan untuk: Memulai eksekusi pengujian dengan judul "20 - Registration Step 1 - Account Empty"
  test('20 - Registration Step 1 - Account Empty', async ({ page }) => {
    // Baris 289 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 291 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('registration-form')).toBeVisible();
    // Baris 293 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/20-registration-step1-empty.png`, fullPage: true });
  });

  // Registration Step 1 - Account Creation (Filled)
  // Baris 299 digunakan untuk: Memulai eksekusi pengujian dengan judul "20a - Registration Step 1 - Account Filled"
  test('20a - Registration Step 1 - Account Filled', async ({ page }) => {
    // Baris 301 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 303 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();

    // Baris 306 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-email').fill('contoh@email.com');
    // Baris 308 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-phone').fill('081234567890');
    // Baris 310 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password').fill('password123');
    // Baris 312 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password-confirm').fill('password123');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/20a-registration-step1-filled.png`, fullPage: true });
  });

  // Registration Step 2 - Personal Info (Empty)
  // Baris 318 digunakan untuk: Memulai eksekusi pengujian dengan judul "21 - Registration Step 2 - Personal Info Empty"
  test('21 - Registration Step 2 - Personal Info Empty', async ({ page }) => {
    // Baris 320 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 322 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();

    const email = generateUniqueEmail();
    // Baris 326 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-email').fill(email);
    // Baris 328 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password').fill('testpassword123');
    // Baris 330 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password-confirm').fill('testpassword123');
    // Baris 332 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step1').click();

    // Baris 335 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step2-form')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/21-registration-step2-empty.png`, fullPage: true });
  });

  // Registration Step 2 - Personal Info (Filled)
  // Baris 341 digunakan untuk: Memulai eksekusi pengujian dengan judul "21a - Registration Step 2 - Personal Info Filled"
  test('21a - Registration Step 2 - Personal Info Filled', async ({ page }) => {
    // Baris 343 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 345 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();

    const email = generateUniqueEmail();
    // Baris 349 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-email').fill(email);
    // Baris 351 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password').fill('testpassword123');
    // Baris 353 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password-confirm').fill('testpassword123');
    // Baris 355 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step1').click();

    // Baris 358 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step2-form')).toBeVisible();
    // Baris 360 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-name').fill('Budi Santoso');
    // Baris 362 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-address').fill('Jl. Merdeka No. 123, RT 01/RW 02, Kelurahan Sukamaju');
    // Baris 364 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-city').fill('Jakarta Selatan');
    // Baris 366 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-province').fill('DKI Jakarta');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/21a-registration-step2-filled.png`, fullPage: true });
  });

  // Registration Step 3 - Education (Empty)
  // Baris 372 digunakan untuk: Memulai eksekusi pengujian dengan judul "22 - Registration Step 3 - Education Empty"
  test('22 - Registration Step 3 - Education Empty', async ({ page }) => {
    // Baris 374 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 376 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();

    const email = generateUniqueEmail();
    // Baris 380 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-email').fill(email);
    // Baris 382 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password').fill('testpassword123');
    // Baris 384 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password-confirm').fill('testpassword123');
    // Baris 386 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step1').click();

    // Baris 389 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step2-form')).toBeVisible();
    // Baris 391 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-name').fill('Test Candidate');
    // Baris 393 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-address').fill('Jl. Test No. 123');
    // Baris 395 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-city').fill('Jakarta');
    // Baris 397 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-province').fill('DKI Jakarta');
    // Baris 399 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step2').click();

    // Baris 402 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step3-form')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/22-registration-step3-empty.png`, fullPage: true });
  });

  // Registration Step 3 - Education (Filled)
  // Baris 408 digunakan untuk: Memulai eksekusi pengujian dengan judul "22a - Registration Step 3 - Education Filled"
  test('22a - Registration Step 3 - Education Filled', async ({ page }) => {
    // Baris 410 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 412 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();

    const email = generateUniqueEmail();
    // Baris 416 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-email').fill(email);
    // Baris 418 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password').fill('testpassword123');
    // Baris 420 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password-confirm').fill('testpassword123');
    // Baris 422 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step1').click();

    // Baris 425 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step2-form')).toBeVisible();
    // Baris 427 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-name').fill('Test Candidate');
    // Baris 429 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-address').fill('Jl. Test No. 123');
    // Baris 431 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-city').fill('Jakarta');
    // Baris 433 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-province').fill('DKI Jakarta');
    // Baris 435 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step2').click();

    // Baris 438 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step3-form')).toBeVisible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    const radioCount = await prodiRadios.count();

    if (radioCount === 0) {
      test.skip();
      return;
    }

    // Baris 449 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-high-school').fill('SMA Negeri 1 Jakarta');
    // Baris 451 digunakan untuk: Memilih opsi dari menu dropdown
    await page.getByTestId('select-graduation-year').selectOption('2025');
    await prodiRadios.first().click();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/22a-registration-step3-filled.png`, fullPage: true });
  });

  // Registration Step 4 - Source Tracking (Empty)
  // Baris 458 digunakan untuk: Memulai eksekusi pengujian dengan judul "23 - Registration Step 4 - Source Tracking Empty"
  test('23 - Registration Step 4 - Source Tracking Empty', async ({ page }) => {
    // Baris 460 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 462 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();

    const email = generateUniqueEmail();
    // Baris 466 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-email').fill(email);
    // Baris 468 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password').fill('testpassword123');
    // Baris 470 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password-confirm').fill('testpassword123');
    // Baris 472 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step1').click();

    // Baris 475 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step2-form')).toBeVisible();
    // Baris 477 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-name').fill('Test Candidate');
    // Baris 479 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-address').fill('Jl. Test No. 123');
    // Baris 481 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-city').fill('Jakarta');
    // Baris 483 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-province').fill('DKI Jakarta');
    // Baris 485 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step2').click();

    // Baris 488 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step3-form')).toBeVisible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    const radioCount = await prodiRadios.count();

    if (radioCount === 0) {
      test.skip();
      return;
    }

    // Baris 499 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-high-school').fill('SMA Negeri 1 Jakarta');
    // Baris 501 digunakan untuk: Memilih opsi dari menu dropdown
    await page.getByTestId('select-graduation-year').selectOption('2025');
    await prodiRadios.first().click();
    // Baris 504 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step3').click();

    // Baris 507 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step4-form')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/23-registration-step4-empty.png`, fullPage: true });
  });

  // Registration Step 4 - Source Tracking (Filled)
  // Baris 513 digunakan untuk: Memulai eksekusi pengujian dengan judul "23a - Registration Step 4 - Source Tracking Filled"
  test('23a - Registration Step 4 - Source Tracking Filled', async ({ page }) => {
    // Baris 515 digunakan untuk: Membuka browser dan menavigasi ke halaman "/register"
    await page.goto('/register');
    // Baris 517 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step1-form')).toBeVisible();

    const email = generateUniqueEmail();
    // Baris 521 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-email').fill(email);
    // Baris 523 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password').fill('testpassword123');
    // Baris 525 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-password-confirm').fill('testpassword123');
    // Baris 527 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step1').click();

    // Baris 530 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step2-form')).toBeVisible();
    // Baris 532 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-name').fill('Test Candidate');
    // Baris 534 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-address').fill('Jl. Test No. 123');
    // Baris 536 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-city').fill('Jakarta');
    // Baris 538 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-province').fill('DKI Jakarta');
    // Baris 540 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step2').click();

    // Baris 543 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step3-form')).toBeVisible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    const radioCount = await prodiRadios.count();

    if (radioCount === 0) {
      test.skip();
      return;
    }

    // Baris 554 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-high-school').fill('SMA Negeri 1 Jakarta');
    // Baris 556 digunakan untuk: Memilih opsi dari menu dropdown
    await page.getByTestId('select-graduation-year').selectOption('2025');
    await prodiRadios.first().click();
    // Baris 559 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('btn-submit-step3').click();

    // Baris 562 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('step4-form')).toBeVisible();
    // Baris 564 digunakan untuk: Memilih opsi dari menu dropdown
    await page.getByTestId('select-source-type').selectOption('friend_family');
    // Baris 566 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('input-source-detail').fill('Kakak tingkat di kampus');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/23a-registration-step4-filled.png`, fullPage: true });
  });

  // Candidate Login Page
  // Baris 572 digunakan untuk: Memulai eksekusi pengujian dengan judul "24 - Candidate Login"
  test('24 - Candidate Login', async ({ page }) => {
    // Baris 574 digunakan untuk: Membuka browser dan menavigasi ke halaman "/login"
    await page.goto('/login');
    // Baris 576 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('portal-login-form')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/24-candidate-login.png`, fullPage: true });
  });
});

// Baris 582 digunakan untuk: Mengelompokkan skenario pengujian tentang "User Manual Screenshots - Candidate Portal"
test.describe('User Manual Screenshots - Candidate Portal', () => {
  // Baris 584 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Login as test candidate
    // Baris 588 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/candidate"
    await page.goto('/test/login/candidate');
    await page.waitForURL(/\/portal\/?$/);
  });

  // Portal Dashboard
  // Baris 594 digunakan untuk: Memulai eksekusi pengujian dengan judul "25 - Portal Dashboard"
  test('25 - Portal Dashboard', async ({ page }) => {
    // Baris 596 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('portal-dashboard')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/25-portal-dashboard.png`, fullPage: true });
  });

  // Portal Documents
  // Baris 602 digunakan untuk: Memulai eksekusi pengujian dengan judul "26 - Portal Documents"
  test('26 - Portal Documents', async ({ page }) => {
    // Baris 604 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/documents"
    await page.goto('/portal/documents');
    // Baris 606 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('documents-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/26-portal-documents.png`, fullPage: true });
  });

  // Portal Payments
  // Baris 612 digunakan untuk: Memulai eksekusi pengujian dengan judul "27 - Portal Payments"
  test('27 - Portal Payments', async ({ page }) => {
    // Baris 614 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/payments"
    await page.goto('/portal/payments');
    // Baris 616 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('payments-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/27-portal-payments.png`, fullPage: true });
  });

  // Portal Announcements
  // Baris 622 digunakan untuk: Memulai eksekusi pengujian dengan judul "28 - Portal Announcements"
  test('28 - Portal Announcements', async ({ page }) => {
    // Baris 624 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/announcements"
    await page.goto('/portal/announcements');
    // Baris 626 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('announcements-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/28-portal-announcements.png`, fullPage: true });
  });
});

// Baris 632 digunakan untuk: Mengelompokkan skenario pengujian tentang "User Manual Screenshots - Admin Dashboard"
test.describe('User Manual Screenshots - Admin Dashboard', () => {
  // Baris 634 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Baris 637 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Admin Dashboard - Overview
  // Baris 643 digunakan untuk: Memulai eksekusi pengujian dengan judul "30 - Admin Dashboard Overview"
  test('30 - Admin Dashboard Overview', async ({ page }) => {
    // Baris 645 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');
    // Baris 647 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/30-admin-dashboard-overview.png`, fullPage: true });
  });

  // Admin Dashboard - Stats Cards
  // Baris 653 digunakan untuk: Memulai eksekusi pengujian dengan judul "30a - Admin Dashboard Stats Cards"
  test('30a - Admin Dashboard Stats Cards', async ({ page }) => {
    // Baris 655 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');
    // Baris 657 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stats-cards')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/30a-admin-dashboard-stats.png`,
      clip: await page.getByTestId('stats-cards').boundingBox() || undefined
    });
  });

  // Admin Dashboard - Overdue Section
  // Baris 666 digunakan untuk: Memulai eksekusi pengujian dengan judul "30b - Admin Dashboard Overdue Section"
  test('30b - Admin Dashboard Overdue Section', async ({ page }) => {
    // Baris 668 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');
    // Baris 670 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('overdue-section')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/30b-admin-dashboard-overdue.png`,
      clip: await page.getByTestId('overdue-section').boundingBox() || undefined
    });
  });

  // Admin Dashboard - Today Tasks Section
  // Baris 679 digunakan untuk: Memulai eksekusi pengujian dengan judul "30c - Admin Dashboard Today Tasks"
  test('30c - Admin Dashboard Today Tasks', async ({ page }) => {
    // Baris 681 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');
    // Baris 683 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('today-tasks-section')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/30c-admin-dashboard-today-tasks.png`,
      clip: await page.getByTestId('today-tasks-section').boundingBox() || undefined
    });
  });

  // Admin Dashboard - Funnel Section
  // Baris 692 digunakan untuk: Memulai eksekusi pengujian dengan judul "30d - Admin Dashboard Funnel"
  test('30d - Admin Dashboard Funnel', async ({ page }) => {
    // Baris 694 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');
    // Baris 696 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('funnel-section')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/30d-admin-dashboard-funnel.png`,
      clip: await page.getByTestId('funnel-section').boundingBox() || undefined
    });
  });

  // Admin Dashboard - Recent Candidates
  // Baris 705 digunakan untuk: Memulai eksekusi pengujian dengan judul "30e - Admin Dashboard Recent Candidates"
  test('30e - Admin Dashboard Recent Candidates', async ({ page }) => {
    // Baris 707 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');
    const section = page.getByTestId('recent-candidates-section');
    // Baris 710 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/30e-admin-dashboard-recent-candidates.png`,
      fullPage: true
    });
  });
});

// Baris 720 digunakan untuk: Mengelompokkan skenario pengujian tentang "User Manual Screenshots - Candidate Management"
test.describe('User Manual Screenshots - Candidate Management', () => {
  // Baris 722 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Baris 725 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Candidates List - Full View
  // Baris 731 digunakan untuk: Memulai eksekusi pengujian dengan judul "31 - Candidates List"
  test('31 - Candidates List', async ({ page }) => {
    // Baris 733 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 735 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/31-candidates-list.png`, fullPage: true });
  });

  // Candidates List - Stats Section
  // Baris 741 digunakan untuk: Memulai eksekusi pengujian dengan judul "31a - Candidates Stats"
  test('31a - Candidates Stats', async ({ page }) => {
    // Baris 743 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 745 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidate-stats')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/31a-candidates-stats.png`,
      clip: await page.getByTestId('candidate-stats').boundingBox() || undefined
    });
  });

  // Candidates List - Filters Section
  // Baris 754 digunakan untuk: Memulai eksekusi pengujian dengan judul "31b - Candidates Filters"
  test('31b - Candidates Filters', async ({ page }) => {
    // Baris 756 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 758 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('filters-section')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/31b-candidates-filters.png`,
      clip: await page.getByTestId('filters-section').boundingBox() || undefined
    });
  });

  // Candidates List - Filter by Status
  // Baris 767 digunakan untuk: Memulai eksekusi pengujian dengan judul "31c - Candidates Filter by Status"
  test('31c - Candidates Filter by Status', async ({ page }) => {
    // Baris 769 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 771 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('filters-section')).toBeVisible();
    // Baris 773 digunakan untuk: Memilih opsi dari menu dropdown
    await page.getByTestId('filter-status').selectOption('prospecting');
    await page.waitForTimeout(500); // Wait for HTMX to update
    await page.screenshot({ path: `${SCREENSHOT_DIR}/31c-candidates-filter-status.png`, fullPage: true });
  });

  // Candidates List - Search
  // Baris 780 digunakan untuk: Memulai eksekusi pengujian dengan judul "31d - Candidates Search"
  test('31d - Candidates Search', async ({ page }) => {
    // Baris 782 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 784 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('filters-section')).toBeVisible();
    // Baris 786 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.getByTestId('filter-search').fill('test');
    await page.waitForTimeout(600); // Wait for debounced HTMX
    await page.screenshot({ path: `${SCREENSHOT_DIR}/31d-candidates-search.png`, fullPage: true });
  });

  // Candidates List - Table
  // Baris 793 digunakan untuk: Memulai eksekusi pengujian dengan judul "31e - Candidates Table"
  test('31e - Candidates Table', async ({ page }) => {
    // Baris 795 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 797 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-table')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/31e-candidates-table.png`,
      clip: await page.getByTestId('candidates-table').boundingBox() || undefined
    });
  });

  // Candidate Detail - Full View
  // Baris 806 digunakan untuk: Memulai eksekusi pengujian dengan judul "32 - Candidate Detail"
  test('32 - Candidate Detail', async ({ page }) => {
    // Find first candidate and navigate
    // Baris 809 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Baris 814 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('candidate-detail-page')).toBeVisible();
      await page.screenshot({ path: `${SCREENSHOT_DIR}/32-candidate-detail.png`, fullPage: true });
    } else {
      test.skip();
    }
  });

  // Candidate Detail - Header
  // Baris 823 digunakan untuk: Memulai eksekusi pengujian dengan judul "32a - Candidate Detail Header"
  test('32a - Candidate Detail Header', async ({ page }) => {
    // Baris 825 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Baris 830 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('candidate-header')).toBeVisible();
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/32a-candidate-detail-header.png`,
        clip: await page.getByTestId('candidate-header').boundingBox() || undefined
      });
    } else {
      test.skip();
    }
  });

  // Candidate Detail - Personal Info Section
  // Baris 842 digunakan untuk: Memulai eksekusi pengujian dengan judul "32b - Candidate Personal Info"
  test('32b - Candidate Personal Info', async ({ page }) => {
    // Baris 844 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Baris 849 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('section-personal-info')).toBeVisible();
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/32b-candidate-personal-info.png`,
        clip: await page.getByTestId('section-personal-info').boundingBox() || undefined
      });
    } else {
      test.skip();
    }
  });

  // Candidate Detail - Education Section
  // Baris 861 digunakan untuk: Memulai eksekusi pengujian dengan judul "32c - Candidate Education"
  test('32c - Candidate Education', async ({ page }) => {
    // Baris 863 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Baris 868 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('section-education')).toBeVisible();
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/32c-candidate-education.png`,
        clip: await page.getByTestId('section-education').boundingBox() || undefined
      });
    } else {
      test.skip();
    }
  });

  // Candidate Detail - Source & Assignment Section
  // Baris 880 digunakan untuk: Memulai eksekusi pengujian dengan judul "32d - Candidate Source Assignment"
  test('32d - Candidate Source Assignment', async ({ page }) => {
    // Baris 882 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Baris 887 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('section-source-assignment')).toBeVisible();
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/32d-candidate-source-assignment.png`,
        clip: await page.getByTestId('section-source-assignment').boundingBox() || undefined
      });
    } else {
      test.skip();
    }
  });

  // Candidate Detail - Timeline Section
  // Baris 899 digunakan untuk: Memulai eksekusi pengujian dengan judul "32e - Candidate Timeline"
  test('32e - Candidate Timeline', async ({ page }) => {
    // Baris 901 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Baris 906 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('section-timeline')).toBeVisible();
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/32e-candidate-timeline.png`,
        clip: await page.getByTestId('section-timeline').boundingBox() || undefined
      });
    } else {
      test.skip();
    }
  });

  // Candidate Detail - Interaction Form Page
  // Baris 918 digunakan untuk: Memulai eksekusi pengujian dengan judul "32f - Candidate Interaction Form"
  test('32f - Candidate Interaction Form', async ({ page }) => {
    // Baris 920 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Baris 925 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('btn-log-interaction')).toBeVisible();
      // Baris 927 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-log-interaction').click();
      // Baris 929 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('interaction-form')).toBeVisible();
      await page.screenshot({ path: `${SCREENSHOT_DIR}/32f-candidate-interaction-form.png`, fullPage: true });
    } else {
      test.skip();
    }
  });
});

// Baris 938 digunakan untuk: Mengelompokkan skenario pengujian tentang "User Manual Screenshots - Education Consultant Features"
test.describe('User Manual Screenshots - Education Consultant Features', () => {
  // Baris 940 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Baris 943 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
  });

  // AC Dashboard - Full View
  // Baris 949 digunakan untuk: Memulai eksekusi pengujian dengan judul "40 - AC Dashboard"
  test('40 - AC Dashboard', async ({ page }) => {
    // Baris 951 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    // Baris 953 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('consultant-dashboard')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/40-ac-dashboard.png`, fullPage: true });
  });

  // AC Dashboard - Welcome Section
  // Baris 959 digunakan untuk: Memulai eksekusi pengujian dengan judul "40a - AC Dashboard Welcome Section"
  test('40a - AC Dashboard Welcome Section', async ({ page }) => {
    // Baris 961 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    // Baris 963 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('welcome-section')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/40a-ac-dashboard-welcome.png`,
      clip: await page.getByTestId('welcome-section').boundingBox() || undefined
    });
  });

  // AC Dashboard - Personal Stats
  // Baris 972 digunakan untuk: Memulai eksekusi pengujian dengan judul "40b - AC Dashboard Personal Stats"
  test('40b - AC Dashboard Personal Stats', async ({ page }) => {
    // Baris 974 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    // Baris 976 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('personal-stats')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/40b-ac-dashboard-stats.png`,
      clip: await page.getByTestId('personal-stats').boundingBox() || undefined
    });
  });

  // AC Dashboard - Overdue Section
  // Baris 985 digunakan untuk: Memulai eksekusi pengujian dengan judul "40c - AC Dashboard Overdue"
  test('40c - AC Dashboard Overdue', async ({ page }) => {
    // Baris 987 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    // Baris 989 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('ac-overdue-section')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/40c-ac-dashboard-overdue.png`,
      clip: await page.getByTestId('ac-overdue-section').boundingBox() || undefined
    });
  });

  // AC Dashboard - Today Tasks Section
  // Baris 998 digunakan untuk: Memulai eksekusi pengujian dengan judul "40d - AC Dashboard Today Tasks"
  test('40d - AC Dashboard Today Tasks', async ({ page }) => {
    // Baris 1000 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    // Baris 1002 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('ac-today-tasks-section')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/40d-ac-dashboard-today-tasks.png`,
      clip: await page.getByTestId('ac-today-tasks-section').boundingBox() || undefined
    });
  });

  // AC Dashboard - Supervisor Suggestions
  // Baris 1011 digunakan untuk: Memulai eksekusi pengujian dengan judul "40e - AC Dashboard Supervisor Suggestions"
  test('40e - AC Dashboard Supervisor Suggestions', async ({ page }) => {
    // Baris 1013 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    const section = page.getByTestId('supervisor-suggestions-section');
    // Baris 1016 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/40e-ac-dashboard-suggestions.png`,
      fullPage: true
    });
  });

  // AC Dashboard - Monthly Performance
  // Baris 1026 digunakan untuk: Memulai eksekusi pengujian dengan judul "40f - AC Dashboard Monthly Performance"
  test('40f - AC Dashboard Monthly Performance', async ({ page }) => {
    // Baris 1028 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    const section = page.getByTestId('monthly-performance-section');
    // Baris 1031 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/40f-ac-dashboard-monthly-performance.png`,
      fullPage: true
    });
  });

  // Interaction Form - Full View (Empty)
  // Baris 1041 digunakan untuk: Memulai eksekusi pengujian dengan judul "41 - Interaction Form"
  test('41 - Interaction Form', async ({ page }) => {
    // Navigate to a candidate's interaction form
    // Baris 1044 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      // Click "Log Interaksi" link or look for interaction form page
      const interactionLink = page.locator('a:has-text("Log")').first();
      if (await interactionLink.count() > 0) {
        await interactionLink.click();
        if (await page.getByTestId('interaction-form-page').count() > 0) {
          // Baris 1054 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(page.getByTestId('interaction-form-page')).toBeVisible();
          await page.screenshot({ path: `${SCREENSHOT_DIR}/41-interaction-form.png`, fullPage: true });
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  // Interaction Form - Channel Options
  // Baris 1069 digunakan untuk: Memulai eksekusi pengujian dengan judul "41a - Interaction Form Channel Options"
  test('41a - Interaction Form Channel Options', async ({ page }) => {
    // Baris 1071 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      const interactionLink = page.locator('a:has-text("Log")').first();
      if (await interactionLink.count() > 0) {
        await interactionLink.click();
        if (await page.getByTestId('channel-section').count() > 0) {
          // Baris 1080 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(page.getByTestId('channel-section')).toBeVisible();
          await page.screenshot({
            path: `${SCREENSHOT_DIR}/41a-interaction-form-channels.png`,
            clip: await page.getByTestId('channel-section').boundingBox() || undefined
          });
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  // Interaction Form - Category Options
  // Baris 1098 digunakan untuk: Memulai eksekusi pengujian dengan judul "41b - Interaction Form Category Options"
  test('41b - Interaction Form Category Options', async ({ page }) => {
    // Baris 1100 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    const candidateLink = page.locator('[data-testid="candidate-name"]').first();
    if (await candidateLink.count() > 0) {
      await candidateLink.click();
      const interactionLink = page.locator('a:has-text("Log")').first();
      if (await interactionLink.count() > 0) {
        await interactionLink.click();
        if (await page.getByTestId('category-section').count() > 0) {
          // Baris 1109 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(page.getByTestId('category-section')).toBeVisible();
          await page.screenshot({
            path: `${SCREENSHOT_DIR}/41b-interaction-form-categories.png`,
            clip: await page.getByTestId('category-section').boundingBox() || undefined
          });
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });
});

// Baris 1127 digunakan untuk: Mengelompokkan skenario pengujian tentang "User Manual Screenshots - Consultant Performance Reports"
test.describe('User Manual Screenshots - Consultant Performance Reports', () => {
  // Baris 1129 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Baris 1132 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Consultant Report - Full View
  // Baris 1138 digunakan untuk: Memulai eksekusi pengujian dengan judul "50 - Consultant Report"
  test('50 - Consultant Report', async ({ page }) => {
    // Baris 1140 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/reports/consultants"
    await page.goto('/admin/reports/consultants');
    // Baris 1142 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('consultant-report-page')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/50-consultant-report.png`, fullPage: true });
  });

  // Consultant Report - Filter Section
  // Baris 1148 digunakan untuk: Memulai eksekusi pengujian dengan judul "50a - Consultant Report Filters"
  test('50a - Consultant Report Filters', async ({ page }) => {
    // Baris 1150 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/reports/consultants"
    await page.goto('/admin/reports/consultants');
    // Baris 1152 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('report-filter')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/50a-consultant-report-filters.png`,
      clip: await page.getByTestId('report-filter').boundingBox() || undefined
    });
  });

  // Consultant Report - Summary Cards
  // Baris 1161 digunakan untuk: Memulai eksekusi pengujian dengan judul "50b - Consultant Report Summary"
  test('50b - Consultant Report Summary', async ({ page }) => {
    // Baris 1163 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/reports/consultants"
    await page.goto('/admin/reports/consultants');
    // Baris 1165 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('report-summary')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/50b-consultant-report-summary.png`,
      clip: await page.getByTestId('report-summary').boundingBox() || undefined
    });
  });
});
