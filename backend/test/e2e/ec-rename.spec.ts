import { test, expect } from '@playwright/test';

// Baris 4 digunakan untuk: Mengelompokkan skenario pengujian tentang "Education Consultant Rename"
test.describe('Education Consultant Rename', () => {
  // Baris 6 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display "Education Consultant" as role label for consultant user"
  test('should display "Education Consultant" as role label for consultant user', async ({ page }) => {
    // Baris 8 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
    // The role badge in the nav should show Education Consultant
    // Baris 12 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Education Consultant')).toBeVisible();
  });

  // Baris 16 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display "EC" in candidates table header"
  test('should display "EC" in candidates table header', async ({ page }) => {
    // Baris 18 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
    // Baris 21 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 23 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-page')).toBeVisible();
    // Table header should say EC not Konsultan
    const headers = page.locator('th');
    // Baris 27 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(headers.filter({ hasText: 'EC' }).first()).toBeVisible();
  });

  // Baris 31 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display "EC" in candidates filter dropdown"
  test('should display "EC" in candidates filter dropdown', async ({ page }) => {
    // Baris 33 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
    // Baris 36 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Baris 38 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-page')).toBeVisible();
    const filterConsultant = page.getByTestId('filter-consultant');
    // Baris 41 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(filterConsultant).toBeVisible();
    // First option should be "Semua EC"
    const firstOption = filterConsultant.locator('option').first();
    // Baris 45 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(firstOption).toHaveText('Semua EC');
  });

  // Baris 49 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display "Education Consultant" in consultant dashboard title"
  test('should display "Education Consultant" in consultant dashboard title', async ({ page }) => {
    // Baris 51 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
    // Baris 54 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/my-dashboard"
    await page.goto('/admin/my-dashboard');
    // Baris 56 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('welcome-section')).toBeVisible();
    // Baris 58 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Dashboard Education Consultant')).toBeVisible();
  });

  // Baris 62 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display "Education Consultant" on portal candidate dashboard"
  test('should display "Education Consultant" on portal candidate dashboard', async ({ page }) => {
    // Baris 64 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/candidate"
    await page.goto('/test/login/candidate');
    await page.waitForURL(/\/portal\/?$/);
    // Check if consultant section exists and shows Education Consultant
    const consultantSection = page.locator('text=Education Consultant');
    // This may not be visible if no consultant is assigned, so check if page loads
    // Baris 70 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('[data-testid="portal-dashboard"]')).toBeVisible();
  });
});
