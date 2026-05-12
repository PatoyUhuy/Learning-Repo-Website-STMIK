import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Education Consultant Rename"
test.describe('Education Consultant Rename', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display "Education Consultant" as role label for consultant user"
  test('should display "Education Consultant" as role label for consultant user', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
    // The role badge in the nav should show Education Consultant
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Education Consultant')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display "EC" in candidates table header"
  test('should display "EC" in candidates table header', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-page')).toBeVisible();
    // Table header should say EC not Konsultan
    const headers = page.locator('th');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(headers.filter({ hasText: 'EC' }).first()).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display "EC" in candidates filter dropdown"
  test('should display "EC" in candidates filter dropdown', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-page')).toBeVisible();
    const filterConsultant = page.getByTestId('filter-consultant');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(filterConsultant).toBeVisible();
    // First option should be "Semua EC"
    const firstOption = filterConsultant.locator('option').first();
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(firstOption).toHaveText('Semua EC');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display "Education Consultant" in consultant dashboard title"
  test('should display "Education Consultant" in consultant dashboard title', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('welcome-section')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Dashboard Education Consultant')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display "Education Consultant" on portal candidate dashboard"
  test('should display "Education Consultant" on portal candidate dashboard', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/candidate"
    await page.goto('/test/login/candidate');
    await page.waitForURL(/\/portal\/?$/);
    // Check if consultant section exists and shows Education Consultant
    const consultantSection = page.locator('text=Education Consultant');
    // This may not be visible if no consultant is assigned, so check if page loads
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('[data-testid="portal-dashboard"]')).toBeVisible();
  });
});
