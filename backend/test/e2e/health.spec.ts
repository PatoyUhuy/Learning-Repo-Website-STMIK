import { test, expect } from '@playwright/test';
import { TestPortalPage, AdminPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Health Check API"
test.describe('Health Check API', () => {
  // Kegunaan: Menguji apakah endpoint /health mengembalikan status OK beserta info versi
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

// Kegunaan: Mengelompokkan skenario pengujian tentang "Version Display in UI"
test.describe('Version Display in UI', () => {
  // Kegunaan: Menguji apakah halaman Portal menampilkan versi di footer
  test('Portal page displays version in footer', async ({ page }) => {
    const portalPage = new TestPortalPage(page);
    await portalPage.goto();
    await portalPage.expectPageLoaded();
    await portalPage.expectVersionVisible();
  });

  // Kegunaan: Menguji apakah halaman Admin menampilkan versi di sidebar
  test('Admin page displays version in sidebar', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.expectPageLoaded();
    await adminPage.expectVersionVisible();
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "CSRF Protection"
test.describe('CSRF Protection', () => {
  // Kegunaan: Menguji apakah form submission dari origin yang sama berhasil
  test('Same-origin form submission works', async ({ page }) => {
    const portalPage = new TestPortalPage(page);
    await portalPage.goto();

    const response = await portalPage.fillAndSubmitForm('test value');
    expect(response?.ok()).toBeTruthy();
  });

  // Kegunaan: Menguji apakah request POST dari origin asing (cross-site) diblokir
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

  // Kegunaan: Menguji apakah request tanpa header Sec-Fetch-Site dari same origin tetap berhasil
  test('Request without Sec-Fetch-Site header from same origin works', async ({ request }) => {
    const response = await request.post('/test/submit', {
      data: { test: 'value' },
    });

    expect(response.ok()).toBeTruthy();
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Navigation"
test.describe('Navigation', () => {
  // Kegunaan: Menguji apakah link navigasi di halaman Portal tampil dengan benar
  test('Portal navigation links are present', async ({ page }) => {
    const portalPage = new TestPortalPage(page);
    await portalPage.goto();
    await portalPage.expectNavigationVisible();
  });

  // Kegunaan: Menguji apakah link navigasi di halaman Admin tampil dengan benar
  test('Admin navigation links are present', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.expectNavigationVisible();
  });
});
