import { test, expect } from '@playwright/test';
import { TestPortalPage, AdminPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Health Check API"
test.describe('Health Check API', () => {
  // Baris 7 digunakan untuk: Memulai eksekusi pengujian dengan judul "GET /health returns ok status with version info"
  test('GET /health returns ok status with version info', async ({ request }) => {
    const response = await request.get('/health');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.version).toBeDefined();
    expect(body.version.commit).toBeDefined();
    expect(body.version.short).toBeDefined();
    expect(body.version.branch).toBeDefined();
    expect(body.version.build_time).toBeDefined();
  });
});

// Baris 24 digunakan untuk: Mengelompokkan skenario pengujian tentang "Version Display in UI"
test.describe('Version Display in UI', () => {
  // Baris 26 digunakan untuk: Memulai eksekusi pengujian dengan judul "Portal page displays version in footer"
  test('Portal page displays version in footer', async ({ page }) => {
    // Baris 28 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new TestPortalPage(page);
    await portalPage.goto();
    await portalPage.expectPageLoaded();
    await portalPage.expectVersionVisible();
  });

  // Baris 35 digunakan untuk: Memulai eksekusi pengujian dengan judul "Admin page displays version in sidebar"
  test('Admin page displays version in sidebar', async ({ page }) => {
    // Baris 37 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.expectPageLoaded();
    await adminPage.expectVersionVisible();
  });
});

// Baris 45 digunakan untuk: Mengelompokkan skenario pengujian tentang "CSRF Protection"
test.describe('CSRF Protection', () => {
  // Baris 47 digunakan untuk: Memulai eksekusi pengujian dengan judul "Same-origin form submission works"
  test('Same-origin form submission works', async ({ page }) => {
    // Baris 49 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new TestPortalPage(page);
    await portalPage.goto();

    const response = await portalPage.fillAndSubmitForm('test value');
    expect(response?.ok()).toBeTruthy();
  });

  // Baris 57 digunakan untuk: Memulai eksekusi pengujian dengan judul "Cross-origin POST request is blocked"
  test('Cross-origin POST request is blocked', async ({ request }) => {
    const response = await request.post('/test/submit', {
      headers: {
        'Origin': 'https://evil-site.com',
        'Sec-Fetch-Site': 'cross-site',
      },
      data: { test: 'value' },
    });

    expect(response.status()).toBe(403);
  });

  // Baris 70 digunakan untuk: Memulai eksekusi pengujian dengan judul "Request without Sec-Fetch-Site header from same origin works"
  test('Request without Sec-Fetch-Site header from same origin works', async ({ request }) => {
    const response = await request.post('/test/submit', {
      data: { test: 'value' },
    });

    expect(response.ok()).toBeTruthy();
  });
});

// Baris 80 digunakan untuk: Mengelompokkan skenario pengujian tentang "Navigation"
test.describe('Navigation', () => {
  // Baris 82 digunakan untuk: Memulai eksekusi pengujian dengan judul "Portal navigation links are present"
  test('Portal navigation links are present', async ({ page }) => {
    // Baris 84 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const portalPage = new TestPortalPage(page);
    await portalPage.goto();
    await portalPage.expectNavigationVisible();
  });

  // Baris 90 digunakan untuk: Memulai eksekusi pengujian dengan judul "Admin navigation links are present"
  test('Admin navigation links are present', async ({ page }) => {
    // Baris 92 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.expectNavigationVisible();
  });
});
