import { test, expect } from '@playwright/test';
import { PortalPage, RegistrationPage, LoginPage } from './pages';

// Generate unique identifiers for test data
function generateUniqueEmail(): string {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
}

// Baris 11 digunakan untuk: Mengelompokkan skenario pengujian tentang "Portal Dashboard - Authentication"
test.describe('Portal Dashboard - Authentication', () => {
  // Baris 13 digunakan untuk: Memulai eksekusi pengujian dengan judul "should redirect to login when accessing portal without session"
  test('should redirect to login when accessing portal without session', async ({ page }) => {
    // Clear any existing cookies
    await page.context().clearCookies();

    // Try to access portal directly
    // Baris 19 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');

    // Should redirect to login
    // Baris 23 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });

  // Baris 27 digunakan untuk: Memulai eksekusi pengujian dengan judul "should redirect to login when session is invalid"
  test('should redirect to login when session is invalid', async ({ page }) => {
    // Set an invalid session cookie
    await page.context().addCookies([{
      name: 'session',
      value: 'invalid-token',
      domain: 'localhost',
      path: '/',
    }]);

    // Baris 37 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');

    // Should redirect to login
    // Baris 41 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});

// Baris 46 digunakan untuk: Mengelompokkan skenario pengujian tentang "Portal Dashboard - Candidate View"
test.describe('Portal Dashboard - Candidate View', () => {
  let testEmail: string;
  const testPassword = 'testpassword123';
  const testName = 'Portal Test User';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate with complete registration
    // Baris 54 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 56 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    testEmail = generateUniqueEmail();

    await registrationPage.goto();
    await registrationPage.expectPageLoaded();
    await registrationPage.fillStep1WithEmail(testEmail, testPassword);
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(testName, 'Jl. Test No. 789', 'Bogor', 'Jawa Barat');
    await registrationPage.expectStep3Visible();

    // Check if there are programs available
    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    const radioCount = await prodiRadios.count();

    if (radioCount > 0) {
      await registrationPage.inputHighSchool.fill('SMA Negeri 1 Bogor');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('google');
    }

    // Baris 80 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 84 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display dashboard with candidate information after login"
  test('should display dashboard with candidate information after login', async ({ page }) => {
    // Baris 86 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Baris 88 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    // Verify dashboard is loaded
    await portalPage.expectPageLoaded();

    // Verify candidate name is displayed
    await portalPage.expectWelcomeMessage(testName);
  });

  // Baris 103 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display checklist items"
  test('should display checklist items', async ({ page }) => {
    // Baris 105 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Baris 107 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.expectChecklistVisible();

    // Should have at least 4 checklist items (email verification, personal info, education, documents, payment)
    const itemCount = await portalPage.getChecklistItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(4);
  });

  // Baris 121 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display announcements section"
  test('should display announcements section', async ({ page }) => {
    // Baris 123 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Baris 125 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.expectAnnouncementsVisible();
  });

  // Baris 135 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display status badge"
  test('should display status badge', async ({ page }) => {
    // Baris 137 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Baris 139 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    // Should display status (registered or another valid status)
    // Baris 147 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(portalPage.statusBadge).toBeVisible();
  });

  // Baris 151 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to documents page"
  test('should navigate to documents page', async ({ page }) => {
    // Baris 153 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Baris 155 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.clickDocuments();
    // Baris 163 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/portal/documents');
  });

  // Baris 167 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to payments page"
  test('should navigate to payments page', async ({ page }) => {
    // Baris 169 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Baris 171 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.clickPayments();
    // Baris 179 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/portal/payments');
  });

  // Baris 183 digunakan untuk: Memulai eksekusi pengujian dengan judul "should logout successfully"
  test('should logout successfully', async ({ page }) => {
    // Baris 185 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Baris 187 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.logout();
    // Baris 195 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');

    // Trying to access portal should redirect to login
    // Baris 199 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');
    // Baris 201 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});

// Baris 206 digunakan untuk: Mengelompokkan skenario pengujian tentang "Portal Documents Page"
test.describe('Portal Documents Page', () => {
  // Baris 208 digunakan untuk: Memulai eksekusi pengujian dengan judul "should redirect to login when not authenticated"
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.context().clearCookies();
    // Baris 211 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/documents"
    await page.goto('/portal/documents');
    // Baris 213 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});

// Baris 218 digunakan untuk: Mengelompokkan skenario pengujian tentang "Portal Payments Page"
test.describe('Portal Payments Page', () => {
  // Baris 220 digunakan untuk: Memulai eksekusi pengujian dengan judul "should redirect to login when not authenticated"
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.context().clearCookies();
    // Baris 223 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal/payments"
    await page.goto('/portal/payments');
    // Baris 225 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});
