import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Password Reset"
test.describe('Password Reset', () => {
  // Kegunaan: Mengelompokkan skenario pengujian tentang "Forgot Password Page"
  test.describe('Forgot Password Page', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display forgot password form"
    test('should display forgot password form', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/forgot-password"
      await page.goto('/forgot-password');
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('forgot-password-form')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-email')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('btn-send-reset')).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should have link from login page"
    test('should have link from login page', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/login"
      await page.goto('/login');
      const forgotLink = page.getByTestId('link-forgot-password');
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(forgotLink).toBeVisible();
      await forgotLink.click();
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL('/forgot-password');
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should redirect to reset password page after submitting email"
    test('should redirect to reset password page after submitting email', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/forgot-password"
      await page.goto('/forgot-password');
      // Kegunaan: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-email').fill('nonexistent@example.com');
      // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-send-reset').click();
      // Should redirect to reset-password page regardless of email existence (anti-enumeration)
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/\/reset-password/);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should require email field"
    test('should require email field', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/forgot-password"
      await page.goto('/forgot-password');
      // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-send-reset').click();
      // HTML5 validation should prevent submission — stays on same page
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL('/forgot-password');
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Reset Password Page"
  test.describe('Reset Password Page', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display reset password form with OTP and password fields"
    test('should display reset password form with OTP and password fields', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('reset-password-form')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-otp')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-password')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-password-confirm')).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('btn-reset-password')).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should show error for mismatched passwords"
    test('should show error for mismatched passwords', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      // Kegunaan: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-otp').fill('123456');
      // Kegunaan: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password').fill('newpassword123');
      // Kegunaan: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password-confirm').fill('differentpassword');
      // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-reset-password').click();

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('error-message')).toBeVisible();
      // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(page.getByTestId('error-message')).toContainText('tidak cocok');
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should show error for invalid OTP"
    test('should show error for invalid OTP', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      // Kegunaan: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-otp').fill('000000');
      // Kegunaan: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password').fill('newpassword123');
      // Kegunaan: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password-confirm').fill('newpassword123');
      // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-reset-password').click();

      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('error-message')).toBeVisible();
      // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(page.getByTestId('error-message')).toContainText('tidak valid');
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should have back to login link"
    test('should have back to login link', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      const loginLink = page.locator('a[href="/login"]');
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(loginLink).toBeVisible();
    });
  });
});
