import { test, expect } from '@playwright/test';
import { PortalPage, RegistrationPage, LoginPage } from './pages';

// Generate unique identifiers for test data
function generateUniqueEmail(): string {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
}

// Kegunaan: Mengelompokkan skenario pengujian tentang "Portal Dashboard - Authentication"
test.describe('Portal Dashboard - Authentication', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "should redirect to login when accessing portal without session"
  test('should redirect to login when accessing portal without session', async ({ page }) => {
    // Clear any existing cookies
    await page.context().clearCookies();

    // Try to access portal directly
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');

    // Should redirect to login
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should redirect to login when session is invalid"
  test('should redirect to login when session is invalid', async ({ page }) => {
    // Set an invalid session cookie
    await page.context().addCookies([{
      name: 'session',
      value: 'invalid-token',
      domain: 'localhost',
      path: '/',
    }]);

    // Kegunaan: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');

    // Should redirect to login
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Portal Dashboard - Candidate View"
test.describe('Portal Dashboard - Candidate View', () => {
  let testEmail: string;
  const testPassword = 'testpassword123';
  const testName = 'Portal Test User';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate with complete registration
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
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

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display dashboard with candidate information after login"
  test('should display dashboard with candidate information after login', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
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

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display checklist items"
  test('should display checklist items', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.expectChecklistVisible();

    // Should have at least 4 checklist items (email verification, personal info, education, documents, payment)
    const itemCount = await portalPage.getChecklistItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(4);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display announcements section"
  test('should display announcements section', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.expectAnnouncementsVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display status badge"
  test('should display status badge', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    // Should display status (registered or another valid status)
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(portalPage.statusBadge).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should navigate to documents page"
  test('should navigate to documents page', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.clickDocuments();
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/portal/documents');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should navigate to payments page"
  test('should navigate to payments page', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.clickPayments();
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/portal/payments');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should logout successfully"
  test('should logout successfully', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const loginPage = new LoginPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new PortalPage(page);

    await loginPage.goto();
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();

    await portalPage.logout();
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');

    // Trying to access portal should redirect to login
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Portal Documents Page"
test.describe('Portal Documents Page', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "should redirect to login when not authenticated"
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.context().clearCookies();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/portal/documents"
    await page.goto('/portal/documents');
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Portal Payments Page"
test.describe('Portal Payments Page', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "should redirect to login when not authenticated"
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.context().clearCookies();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/portal/payments"
    await page.goto('/portal/payments');
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/login');
  });
});
