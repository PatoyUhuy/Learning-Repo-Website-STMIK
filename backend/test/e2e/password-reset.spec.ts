import { test, expect } from '@playwright/test';

// Baris 4 digunakan untuk: Mengelompokkan skenario pengujian tentang "Password Reset"
test.describe('Password Reset', () => {
  // Baris 6 digunakan untuk: Mengelompokkan skenario pengujian tentang "Forgot Password Page"
  test.describe('Forgot Password Page', () => {
    // Baris 8 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display forgot password form"
    test('should display forgot password form', async ({ page }) => {
      // Baris 10 digunakan untuk: Membuka browser dan menavigasi ke halaman "/forgot-password"
      await page.goto('/forgot-password');
      // Baris 12 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('forgot-password-form')).toBeVisible();
      // Baris 14 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-email')).toBeVisible();
      // Baris 16 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('btn-send-reset')).toBeVisible();
    });

    // Baris 20 digunakan untuk: Memulai eksekusi pengujian dengan judul "should have link from login page"
    test('should have link from login page', async ({ page }) => {
      // Baris 22 digunakan untuk: Membuka browser dan menavigasi ke halaman "/login"
      await page.goto('/login');
      const forgotLink = page.getByTestId('link-forgot-password');
      // Baris 25 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(forgotLink).toBeVisible();
      await forgotLink.click();
      // Baris 28 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL('/forgot-password');
    });

    // Baris 32 digunakan untuk: Memulai eksekusi pengujian dengan judul "should redirect to reset password page after submitting email"
    test('should redirect to reset password page after submitting email', async ({ page }) => {
      // Baris 34 digunakan untuk: Membuka browser dan menavigasi ke halaman "/forgot-password"
      await page.goto('/forgot-password');
      // Baris 36 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-email').fill('nonexistent@example.com');
      // Baris 38 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-send-reset').click();
      // Should redirect to reset-password page regardless of email existence (anti-enumeration)
      // Baris 41 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/\/reset-password/);
    });

    // Baris 45 digunakan untuk: Memulai eksekusi pengujian dengan judul "should require email field"
    test('should require email field', async ({ page }) => {
      // Baris 47 digunakan untuk: Membuka browser dan menavigasi ke halaman "/forgot-password"
      await page.goto('/forgot-password');
      // Baris 49 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-send-reset').click();
      // HTML5 validation should prevent submission — stays on same page
      // Baris 52 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL('/forgot-password');
    });
  });

  // Baris 57 digunakan untuk: Mengelompokkan skenario pengujian tentang "Reset Password Page"
  test.describe('Reset Password Page', () => {
    // Baris 59 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display reset password form with OTP and password fields"
    test('should display reset password form with OTP and password fields', async ({ page }) => {
      // Baris 61 digunakan untuk: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      // Baris 63 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('reset-password-form')).toBeVisible();
      // Baris 65 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-otp')).toBeVisible();
      // Baris 67 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-password')).toBeVisible();
      // Baris 69 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('input-password-confirm')).toBeVisible();
      // Baris 71 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('btn-reset-password')).toBeVisible();
    });

    // Baris 75 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error for mismatched passwords"
    test('should show error for mismatched passwords', async ({ page }) => {
      // Baris 77 digunakan untuk: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      // Baris 79 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-otp').fill('123456');
      // Baris 81 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password').fill('newpassword123');
      // Baris 83 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password-confirm').fill('differentpassword');
      // Baris 85 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-reset-password').click();

      // Baris 88 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('error-message')).toBeVisible();
      // Baris 90 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(page.getByTestId('error-message')).toContainText('tidak cocok');
    });

    // Baris 94 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error for invalid OTP"
    test('should show error for invalid OTP', async ({ page }) => {
      // Baris 96 digunakan untuk: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      // Baris 98 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-otp').fill('000000');
      // Baris 100 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password').fill('newpassword123');
      // Baris 102 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
      await page.getByTestId('input-password-confirm').fill('newpassword123');
      // Baris 104 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('btn-reset-password').click();

      // Baris 107 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('error-message')).toBeVisible();
      // Baris 109 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(page.getByTestId('error-message')).toContainText('tidak valid');
    });

    // Baris 113 digunakan untuk: Memulai eksekusi pengujian dengan judul "should have back to login link"
    test('should have back to login link', async ({ page }) => {
      // Baris 115 digunakan untuk: Membuka browser dan menavigasi ke halaman "/reset-password?email=test@example.com"
      await page.goto('/reset-password?email=test@example.com');
      const loginLink = page.locator('a[href="/login"]');
      // Baris 118 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(loginLink).toBeVisible();
    });
  });
});
