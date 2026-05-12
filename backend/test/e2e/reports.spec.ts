import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Report Pages"
test.describe('Report Pages', () => {
  // Kegunaan: Mengelompokkan skenario pengujian tentang "Funnel Report"
  test.describe('Funnel Report', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "admin can access funnel report"
    test('admin can access funnel report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/funnel');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('heading', { name: 'Laporan Funnel', level: 2 })).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "funnel report shows stage data"
    test('funnel report shows stage data', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/funnel');

      // Check that funnel visualization is displayed
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.locator('.flex.items-end.justify-center').first()).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "funnel report shows conversion rates"
    test('funnel report shows conversion rates', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/funnel');

      // Check that conversion cards are displayed
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.locator('.grid.grid-cols-3')).toBeVisible();

      await adminPage.close();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Campaign Report"
  test.describe('Campaign Report', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "admin can access campaign report"
    test('admin can access campaign report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/campaigns');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('heading', { name: 'Laporan ROI Kampanye', level: 2 })).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "campaign report shows summary stats"
    test('campaign report shows summary stats', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/campaigns');

      // Check summary stats
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Total Leads')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Total Enrolled')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Avg Conversion')).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "campaign report shows campaign table"
    test('campaign report shows campaign table', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/campaigns');

      // Check table headers using role
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Kampanye' })).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Tipe' })).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Conversion' })).toBeVisible();

      await adminPage.close();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Consultant Report"
  test.describe('Consultant Report', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "admin can access consultant report"
    test('admin can access consultant report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('consultant-report-page')).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant report shows summary"
    test('consultant report shows summary', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('report-summary')).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant report shows leaderboard"
    test('consultant report shows leaderboard', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Check table headers using role
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Rank' })).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'EC' })).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Enrollments' })).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant report has filter"
    test('consultant report has filter', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/consultants');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('report-filter')).toBeVisible();

      await adminPage.close();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Referrer Report"
  test.describe('Referrer Report', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "admin can access referrer report"
    test('admin can access referrer report', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/referrers');

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('heading', { name: 'Leaderboard Referrer', level: 2 })).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "referrer report shows summary"
    test('referrer report shows summary', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/referrers');

      // Check summary stats are visible
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Total Referrer').first()).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByText('Komisi Dibayar').first()).toBeVisible();

      await adminPage.close();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "referrer report shows leaderboard"
    test('referrer report shows leaderboard', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/reports/referrers');

      // Check table headers using role
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Referrer' })).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Total Referral' })).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByRole('columnheader', { name: 'Komisi Dibayar' })).toBeVisible();

      await adminPage.close();
    });
  });
});
