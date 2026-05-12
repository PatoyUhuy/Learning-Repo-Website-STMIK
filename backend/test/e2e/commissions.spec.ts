import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Commission Management"
test.describe('Commission Management', () => {
  // Kegunaan: Mengelompokkan skenario pengujian tentang "Commission List"
  test.describe('Commission List', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "admin can access commissions page"
    test('admin can access commissions page', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('commissions-page')).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "finance user can access commissions page"
    test('finance user can access commissions page', async ({ browser }) => {
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto('/admin/commissions');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(financePage.getByTestId('commissions-page')).toBeVisible();

      await financePage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "commissions page shows stats"
    test('commissions page shows stats', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      // Check stats are visible
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.locator('.grid.grid-cols-3')).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "commissions page has filter tabs"
    test('commissions page has filter tabs', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('filter-tabs')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('filter-pending')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('filter-approved')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('filter-paid')).toBeVisible();

      await adminPage.close();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Commission Filters"
  test.describe('Commission Filters', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "filter by pending status"
    test('filter by pending status', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      await adminPage.getByTestId('filter-pending').click();
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(adminPage).toHaveURL(/status=pending/);

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "filter by approved status"
    test('filter by approved status', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      await adminPage.getByTestId('filter-approved').click();
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(adminPage).toHaveURL(/status=approved/);

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "filter by paid status"
    test('filter by paid status', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      await adminPage.getByTestId('filter-paid').click();
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(adminPage).toHaveURL(/status=paid/);

      await adminPage.close();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Commission CSV Export"
  test.describe('Commission CSV Export', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "export button is visible on commissions page"
    test('export button is visible on commissions page', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('btn-export')).toBeVisible();
      // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(adminPage.getByTestId('btn-export')).toContainText('Export untuk Transfer');

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "export button links to correct endpoint"
    test('export button links to correct endpoint', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      const exportLink = adminPage.getByTestId('btn-export');
      const href = await exportLink.getAttribute('href');
      expect(href).toBe('/admin/commissions/export?status=approved');

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "CSV export returns proper response headers"
    test('CSV export returns proper response headers', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');

      // Use page.request to fetch file directly (avoids download dialog)
      const response = await adminPage.request.get('/admin/commissions/export?status=approved');

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('text/csv');
      expect(response.headers()['content-disposition']).toContain('attachment');
      expect(response.headers()['content-disposition']).toContain('.csv');

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "CSV export contains proper headers"
    test('CSV export contains proper headers', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');

      // Use page.request to fetch file directly (avoids download dialog)
      const response = await adminPage.request.get('/admin/commissions/export?status=approved');
      const body = await response.text();

      // Check CSV header row (after BOM)
      expect(body).toContain('No,Nama Referrer,Tipe,Nama Bank,No Rekening,Atas Nama,Jumlah,Kandidat,Trigger Event,Tanggal Approve');

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "finance user can export commissions"
    test('finance user can export commissions', async ({ browser }) => {
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');

      // Use page.request to fetch file directly (avoids download dialog)
      const response = await financePage.request.get('/admin/commissions/export?status=approved');
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('text/csv');

      await financePage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant cannot export commissions"
    test('consultant cannot export commissions', async ({ browser }) => {
      const consultantPage = await browser.newPage();
      await consultantPage.goto('/test/login/consultant');

      const response = await consultantPage.goto('/admin/commissions/export?status=approved');
      expect(response?.status()).toBe(403);

      await consultantPage.close();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Commission Actions"
  test.describe('Commission Actions', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "batch approve button exists and is disabled when no selection"
    test('batch approve button exists and is disabled when no selection', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/commissions');

      const batchApproveBtn = adminPage.getByTestId('btn-batch-approve');
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(batchApproveBtn).toBeVisible();
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(batchApproveBtn).toBeDisabled();

      await adminPage.close();
    });
  });
});
