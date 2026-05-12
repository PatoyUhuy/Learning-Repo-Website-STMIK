import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Supervisor Dashboard"
test.describe('Supervisor Dashboard', () => {
  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Login as supervisor
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/supervisor"
    await page.goto('/test/login/supervisor');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor can access dashboard"
  test('supervisor can access dashboard', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check welcome section with "Dashboard Supervisor" subtitle
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('supervisor-dashboard')).toBeVisible();
    // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.getByTestId('page-title')).toContainText('Dashboard Supervisor');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows team stats"
  test('supervisor dashboard shows team stats', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for team stats section
    const statsSection = page.getByTestId('team-stats');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection).toBeVisible();

    // Check for stat labels within the stats section
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Registered')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Prospecting')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Committed')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Enrolled')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Lost')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows team performance table"
  test('supervisor dashboard shows team performance table', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for team performance section
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('team-performance-section')).toBeVisible();

    // Check for table headers
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /ec/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /aktif/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /hari ini/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /overdue/i })).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows stuck candidates section"
  test('supervisor dashboard shows stuck candidates section', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for stuck candidates section
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stuck-candidates-section')).toBeVisible();

    // Check for section header
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: /kandidat stuck/i, level: 3 })).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows monthly performance"
  test('supervisor dashboard shows monthly performance', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for monthly performance section
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('monthly-performance-section')).toBeVisible();

    // Check for monthly stats labels
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByText(/leads baru/i)).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByText(/enrollments/i)).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows quick actions"
  test('supervisor dashboard shows quick actions', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for quick actions section
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('quick-actions-section')).toBeVisible();

    // Check for quick action links
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('link', { name: /lihat kandidat stuck/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('link', { name: /lihat report ec/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('link', { name: /lihat funnel report/i })).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor sees team dashboard link in sidebar"
  test('supervisor sees team dashboard link in sidebar', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Check for supervisor dashboard link in sidebar
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('nav-supervisor-dashboard')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByText('Dashboard Tim')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant does not see team dashboard link"
  test('consultant does not see team dashboard link', async ({ page }) => {
    // Login as consultant instead
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Consultant should not see supervisor dashboard link
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('nav-supervisor-dashboard')).not.toBeVisible();
  });
});
