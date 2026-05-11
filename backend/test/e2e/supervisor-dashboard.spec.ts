import { test, expect } from '@playwright/test';

// Baris 4 digunakan untuk: Mengelompokkan skenario pengujian tentang "Supervisor Dashboard"
test.describe('Supervisor Dashboard', () => {
  // Baris 6 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Login as supervisor
    // Baris 9 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/supervisor"
    await page.goto('/test/login/supervisor');
  });

  // Baris 13 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor can access dashboard"
  test('supervisor can access dashboard', async ({ page }) => {
    // Baris 15 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check welcome section with "Dashboard Supervisor" subtitle
    // Baris 19 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('supervisor-dashboard')).toBeVisible();
    // Baris 21 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.getByTestId('page-title')).toContainText('Dashboard Supervisor');
  });

  // Baris 25 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows team stats"
  test('supervisor dashboard shows team stats', async ({ page }) => {
    // Baris 27 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for team stats section
    const statsSection = page.getByTestId('team-stats');
    // Baris 32 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection).toBeVisible();

    // Check for stat labels within the stats section
    // Baris 36 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Registered')).toBeVisible();
    // Baris 38 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Prospecting')).toBeVisible();
    // Baris 40 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Committed')).toBeVisible();
    // Baris 42 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Enrolled')).toBeVisible();
    // Baris 44 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsSection.getByText('Lost')).toBeVisible();
  });

  // Baris 48 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows team performance table"
  test('supervisor dashboard shows team performance table', async ({ page }) => {
    // Baris 50 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for team performance section
    // Baris 54 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('team-performance-section')).toBeVisible();

    // Check for table headers
    // Baris 58 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /ec/i })).toBeVisible();
    // Baris 60 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /aktif/i })).toBeVisible();
    // Baris 62 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /hari ini/i })).toBeVisible();
    // Baris 64 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('columnheader', { name: /overdue/i })).toBeVisible();
  });

  // Baris 68 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows stuck candidates section"
  test('supervisor dashboard shows stuck candidates section', async ({ page }) => {
    // Baris 70 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for stuck candidates section
    // Baris 74 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stuck-candidates-section')).toBeVisible();

    // Check for section header
    // Baris 78 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('heading', { name: /kandidat stuck/i, level: 3 })).toBeVisible();
  });

  // Baris 82 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows monthly performance"
  test('supervisor dashboard shows monthly performance', async ({ page }) => {
    // Baris 84 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for monthly performance section
    // Baris 88 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('monthly-performance-section')).toBeVisible();

    // Check for monthly stats labels
    // Baris 92 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByText(/leads baru/i)).toBeVisible();
    // Baris 94 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByText(/enrollments/i)).toBeVisible();
  });

  // Baris 98 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor dashboard shows quick actions"
  test('supervisor dashboard shows quick actions', async ({ page }) => {
    // Baris 100 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/supervisor-dashboard"
    await page.goto('/admin/supervisor-dashboard');

    // Check for quick actions section
    // Baris 104 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('quick-actions-section')).toBeVisible();

    // Check for quick action links
    // Baris 108 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('link', { name: /lihat kandidat stuck/i })).toBeVisible();
    // Baris 110 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('link', { name: /lihat report ec/i })).toBeVisible();
    // Baris 112 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByRole('link', { name: /lihat funnel report/i })).toBeVisible();
  });

  // Baris 116 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor sees team dashboard link in sidebar"
  test('supervisor sees team dashboard link in sidebar', async ({ page }) => {
    // Baris 118 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Check for supervisor dashboard link in sidebar
    // Baris 122 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('nav-supervisor-dashboard')).toBeVisible();
    // Baris 124 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByText('Dashboard Tim')).toBeVisible();
  });

  // Baris 128 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant does not see team dashboard link"
  test('consultant does not see team dashboard link', async ({ page }) => {
    // Login as consultant instead
    // Baris 131 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    // Baris 133 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Consultant should not see supervisor dashboard link
    // Baris 137 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('nav-supervisor-dashboard')).not.toBeVisible();
  });
});
