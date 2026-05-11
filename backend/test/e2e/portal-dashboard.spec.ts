import { test, expect } from '@playwright/test';
import { RegistrationPage, LoginPage, PortalPage } from './pages';

// Generate unique identifiers for test data with prefix to avoid collisions
function generateUniqueEmail(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}@example.com`;
}

// Baris 12 digunakan untuk: Mengelompokkan skenario pengujian tentang "Candidate Portal Dashboard"
test.describe('Candidate Portal Dashboard', () => {
  let portalPage: PortalPage;
  let testEmail: string;
  const testPassword = 'testpassword123';
  const testName = 'Dashboard Test User';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate through full registration
    // Baris 21 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 23 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    testEmail = generateUniqueEmail('dash');

    await registrationPage.goto();
    await registrationPage.expectPageLoaded();

    // Step 1: Account
    await registrationPage.fillStep1WithEmail(testEmail, testPassword);
    await registrationPage.expectStep2Visible();

    // Step 2: Personal Info
    await registrationPage.fillStep2(
      testName,
      'Jl. Dashboard Test No. 123',
      'Jakarta',
      'DKI Jakarta'
    );
    await registrationPage.expectStep3Visible();

    // Step 3: Education
    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    const radioCount = await prodiRadios.count();

    if (radioCount > 0) {
      await registrationPage.inputHighSchool.fill('SMA Negeri 1 Jakarta');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();

      // Step 4: Source Tracking
      await registrationPage.fillStep4('google');
    }

    // Baris 58 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 62 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Login before each test
    // Baris 65 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    // Baris 71 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    portalPage = new PortalPage(page);
  });

  // Baris 75 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display dashboard after login"
  test('should display dashboard after login', async () => {
    await portalPage.expectPageLoaded();
  });

  // Baris 80 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display candidate name in welcome banner"
  test('should display candidate name in welcome banner', async () => {
    await portalPage.expectWelcomeMessage(testName);
  });

  // Baris 85 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display registration status"
  test('should display registration status', async () => {
    // After completing all 4 steps, status is "Dalam Proses" (prospecting)
    await portalPage.expectStatus('Dalam Proses');
  });

  // Baris 91 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display checklist items"
  test('should display checklist items', async () => {
    await portalPage.expectChecklistVisible();
    const itemCount = await portalPage.getChecklistItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  // Baris 98 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display assigned consultant"
  test('should display assigned consultant', async () => {
    // Consultant should be assigned during registration
    // Check if consultant info is visible
    const consultantSection = portalPage.consultantSection;
    // Baris 103 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(consultantSection).toBeVisible();
  });

  // Baris 107 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display announcements section"
  test('should display announcements section', async () => {
    await portalPage.expectAnnouncementsVisible();
  });

  // Baris 112 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to documents page"
  test('should navigate to documents page', async ({ page }) => {
    await portalPage.clickDocuments();
    // Baris 115 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/portal/documents');
  });

  // Baris 119 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to payments page"
  test('should navigate to payments page', async ({ page }) => {
    await portalPage.clickPayments();
    // Baris 122 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/portal/payments');
  });

  // Baris 126 digunakan untuk: Memulai eksekusi pengujian dengan judul "should logout successfully"
  test('should logout successfully', async ({ page }) => {
    await portalPage.logout();
    // After logout, should redirect to login page
    // Baris 130 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });

  // Baris 134 digunakan untuk: Memulai eksekusi pengujian dengan judul "should redirect to login when accessing portal without session"
  test('should redirect to login when accessing portal without session', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();
    // Try to access portal directly
    // Baris 139 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');
    // Should redirect to login
    // Baris 142 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});

// Baris 147 digunakan untuk: Mengelompokkan skenario pengujian tentang "Portal Documents Page"
test.describe('Portal Documents Page', () => {
  let testEmail: string;
  const testPassword = 'testpassword123';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate
    // Baris 154 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 156 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    testEmail = generateUniqueEmail('docs');

    await registrationPage.goto();
    await registrationPage.fillStep1WithEmail(testEmail, testPassword);
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(
      'Documents Test User',
      'Jl. Documents Test',
      'Bandung',
      'Jawa Barat'
    );
    await registrationPage.expectStep3Visible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    if ((await prodiRadios.count()) > 0) {
      await registrationPage.inputHighSchool.fill('SMA Test');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('instagram');
    }

    // Baris 181 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 185 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 187 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();
  });

  // Baris 194 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display documents page"
  test('should display documents page', async ({ page }) => {
    // Baris 196 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/documents"
    await page.goto('/portal/documents');
    // Check for document types using headings
    // Baris 199 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: 'KTP' })).toBeVisible();
    // Baris 201 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: 'Pas Foto' })).toBeVisible();
    // Baris 203 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: 'Ijazah' })).toBeVisible();
    // Baris 205 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: 'Transkrip Nilai' })).toBeVisible();
  });

  // Baris 209 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show document upload requirements"
  test('should show document upload requirements', async ({ page }) => {
    // Baris 211 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/documents"
    await page.goto('/portal/documents');
    // Check for format info (actual text from template)
    // Baris 214 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Gunakan format JPG, PNG, atau PDF').first()).toBeVisible();
  });
});

// Baris 219 digunakan untuk: Mengelompokkan skenario pengujian tentang "Portal Payments Page"
test.describe('Portal Payments Page', () => {
  let testEmail: string;
  const testPassword = 'testpassword123';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate
    // Baris 226 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 228 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    testEmail = generateUniqueEmail('pay');

    await registrationPage.goto();
    await registrationPage.fillStep1WithEmail(testEmail, testPassword);
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(
      'Payments Test User',
      'Jl. Payments Test',
      'Surabaya',
      'Jawa Timur'
    );
    await registrationPage.expectStep3Visible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    if ((await prodiRadios.count()) > 0) {
      await registrationPage.inputHighSchool.fill('SMA Test');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('youtube');
    }

    // Baris 253 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 257 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 259 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();
  });

  // Baris 266 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display payments page"
  test('should display payments page', async ({ page }) => {
    // Baris 268 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/payments"
    await page.goto('/portal/payments');
    // Page should load without error - use exact heading role
    // Baris 271 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: 'Pembayaran', exact: true })).toBeVisible();
  });

  // Baris 275 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show payment summary"
  test('should show payment summary', async ({ page }) => {
    // Baris 277 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/payments"
    await page.goto('/portal/payments');
    // Check for summary section (even if empty) - use first() to avoid ambiguity
    // Baris 280 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Total').first()).toBeVisible();
  });
});

// Baris 285 digunakan untuk: Mengelompokkan skenario pengujian tentang "Portal Announcements Page"
test.describe('Portal Announcements Page', () => {
  let testEmail: string;
  const testPassword = 'testpassword123';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate
    // Baris 292 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 294 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    testEmail = generateUniqueEmail('ann');

    await registrationPage.goto();
    await registrationPage.fillStep1WithEmail(testEmail, testPassword);
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(
      'Announcements Test User',
      'Jl. Announcements Test',
      'Yogyakarta',
      'DI Yogyakarta'
    );
    await registrationPage.expectStep3Visible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    if ((await prodiRadios.count()) > 0) {
      await registrationPage.inputHighSchool.fill('SMA Test');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('tiktok');
    }

    // Baris 319 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 323 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 325 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();
  });

  // Baris 332 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display announcements page"
  test('should display announcements page', async ({ page }) => {
    // Baris 334 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/announcements"
    await page.goto('/portal/announcements');
    // Page should load without error - use heading role
    // Baris 337 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: 'Pengumuman' })).toBeVisible();
  });
});
