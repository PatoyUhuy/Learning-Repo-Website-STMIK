import { test, expect } from '@playwright/test';

// Baris 4 digunakan untuk: Mengelompokkan skenario pengujian tentang "Report Pages"
test.describe('Report Pages', () => {
  // Baris 6 digunakan untuk: Mengelompokkan skenario pengujian tentang "Funnel Report"
  test.describe('Funnel Report', () => {
    // Baris 8 digunakan untuk: Memulai eksekusi pengujian dengan judul "admin can access funnel report"
    test('admin can access funnel report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/funnel');

      // Baris 14 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('heading', { name: 'Laporan Funnel', level: 2 })).toBeVisible();

      await adminPage.close();
    });

    // Baris 20 digunakan untuk: Memulai eksekusi pengujian dengan judul "funnel report shows stage data"
    test('funnel report shows stage data', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/funnel');

      // Check that funnel visualization is displayed
      // Baris 27 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.locator('.flex.items-end.justify-center').first()).toBeVisible();

      await adminPage.close();
    });

    // Baris 33 digunakan untuk: Memulai eksekusi pengujian dengan judul "funnel report shows conversion rates"
    test('funnel report shows conversion rates', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/funnel');

      // Check that conversion cards are displayed
      // Baris 40 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.locator('.grid.grid-cols-3')).toBeVisible();

      await adminPage.close();
    });
  });

  // Baris 47 digunakan untuk: Mengelompokkan skenario pengujian tentang "Campaign Report"
  test.describe('Campaign Report', () => {
    // Baris 49 digunakan untuk: Memulai eksekusi pengujian dengan judul "admin can access campaign report"
    test('admin can access campaign report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/campaigns');

      // Baris 55 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('heading', { name: 'Laporan ROI Kampanye', level: 2 })).toBeVisible();

      await adminPage.close();
    });

    // Baris 61 digunakan untuk: Memulai eksekusi pengujian dengan judul "campaign report shows summary stats"
    test('campaign report shows summary stats', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/campaigns');

      // Check summary stats
      // Baris 68 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Total Leads')).toBeVisible();
      // Baris 70 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Total Enrolled')).toBeVisible();
      // Baris 72 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Avg Conversion')).toBeVisible();

      await adminPage.close();
    });

    // Baris 78 digunakan untuk: Memulai eksekusi pengujian dengan judul "campaign report shows campaign table"
    test('campaign report shows campaign table', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/campaigns');

      // Check table headers using role
      // Baris 85 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Kampanye' })).toBeVisible();
      // Baris 87 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Tipe' })).toBeVisible();
      // Baris 89 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Conversion' })).toBeVisible();

      await adminPage.close();
    });
  });

  // Baris 96 digunakan untuk: Mengelompokkan skenario pengujian tentang "Consultant Report"
  test.describe('Consultant Report', () => {
    // Baris 98 digunakan untuk: Memulai eksekusi pengujian dengan judul "admin can access consultant report"
    test('admin can access consultant report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Baris 104 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('consultant-report-page')).toBeVisible();

      await adminPage.close();
    });

    // Baris 110 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant report shows summary"
    test('consultant report shows summary', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Baris 116 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('report-summary')).toBeVisible();

      await adminPage.close();
    });

    // Baris 122 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant report shows leaderboard"
    test('consultant report shows leaderboard', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Check table headers using role
      // Baris 129 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Rank' })).toBeVisible();
      // Baris 131 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'EC' })).toBeVisible();
      // Baris 133 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Enrollments' })).toBeVisible();

      await adminPage.close();
    });

    // Baris 139 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant report has filter"
    test('consultant report has filter', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Baris 145 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('report-filter')).toBeVisible();

      await adminPage.close();
    });
  });

  // Baris 152 digunakan untuk: Mengelompokkan skenario pengujian tentang "Referrer Report"
  test.describe('Referrer Report', () => {
    // Baris 154 digunakan untuk: Memulai eksekusi pengujian dengan judul "admin can access referrer report"
    test('admin can access referrer report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/referrers');

      // Baris 160 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('heading', { name: 'Leaderboard Referrer', level: 2 })).toBeVisible();

      await adminPage.close();
    });

    // Baris 166 digunakan untuk: Memulai eksekusi pengujian dengan judul "referrer report shows summary"
    test('referrer report shows summary', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/referrers');

      // Check summary stats are visible
      // Baris 173 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Total Referrer').first()).toBeVisible();
      // Baris 175 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Komisi Dibayar').first()).toBeVisible();

      await adminPage.close();
    });

    // Baris 181 digunakan untuk: Memulai eksekusi pengujian dengan judul "referrer report shows leaderboard"
    test('referrer report shows leaderboard', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/referrers');

      // Check table headers using role
      // Baris 188 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Referrer' })).toBeVisible();
      // Baris 190 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Total Referral' })).toBeVisible();
      // Baris 192 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Komisi Dibayar' })).toBeVisible();

      await adminPage.close();
    });
  });
});
