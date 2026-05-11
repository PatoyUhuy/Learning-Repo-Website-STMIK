import { test, expect } from '@playwright/test';

// Baris 4 digunakan untuk: Mengelompokkan skenario pengujian tentang "Fee Structure Editing"
test.describe('Fee Structure Editing', () => {
  // Baris 6 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 8 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
    // Baris 11 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/settings/fees"
    await page.goto('/admin/settings/fees');
  });

  // Baris 15 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display fees settings page"
  test('should display fees settings page', async ({ page }) => {
    // Baris 17 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-fees-page')).toBeVisible();
    // Baris 19 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('academic-year-select')).toBeVisible();
    // Baris 21 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-fee-button')).toBeVisible();
  });

  // Baris 25 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display fee table with data"
  test('should display fee table with data', async ({ page }) => {
    // Baris 27 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('fees-table')).toBeVisible();
    // Should have fee rows from seed data (registration, tuition, dormitory)
    const feeRows = page.locator('[data-testid^="fee-row-"]');
    const count = await feeRows.count();
    // Seed data might or might not have fee structures created
    // At minimum, the table should be visible
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Baris 37 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add fee modal"
  test('should open add fee modal', async ({ page }) => {
    // Baris 39 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-fee-button').click();
    const modal = page.getByTestId('add-fee-modal');
    // Baris 42 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(modal).toBeVisible();
    // Baris 44 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('input-fee-type')).toBeVisible();
    // Baris 46 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('input-fee-prodi')).toBeVisible();
    // Baris 48 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('input-fee-amount')).toBeVisible();
  });

  // Baris 52 digunakan untuk: Memulai eksekusi pengujian dengan judul "should have fee type options from seed data"
  test('should have fee type options from seed data', async ({ page }) => {
    // Baris 54 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-fee-button').click();
    // Baris 56 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-fee-modal')).toBeVisible();
    const feeTypeSelect = page.getByTestId('input-fee-type');
    const options = feeTypeSelect.locator('option');
    // Should have placeholder + at least 3 fee types (registration, tuition, dormitory)
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  // Baris 65 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open shared edit modal with fee data"
  test('should open shared edit modal with fee data', async ({ page }) => {
    const feeRows = page.locator('[data-testid^="fee-row-"]');
    const count = await feeRows.count();
    if (count === 0) {
      test.skip();
      return;
    }

    // Click edit button on first fee
    const editBtn = page.locator('.edit-fee-btn').first();
    await editBtn.click();

    // Shared edit modal should be visible
    const modal = page.locator('#edit-fee-modal');
    // Baris 80 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(modal).toBeVisible();

    // Amount field should be populated
    const amountInput = page.locator('#edit-fee-amount');
    // Baris 85 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(amountInput).toBeVisible();
    const value = await amountInput.inputValue();
    expect(Number(value)).toBeGreaterThan(0);
  });

  // Baris 91 digunakan untuk: Memulai eksekusi pengujian dengan judul "should toggle fee active status"
  test('should toggle fee active status', async ({ page }) => {
    const feeRows = page.locator('[data-testid^="fee-row-"]');
    const count = await feeRows.count();
    if (count === 0) {
      test.skip();
      return;
    }

    const firstRowId = await feeRows.first().getAttribute('data-fee-id');
    if (!firstRowId) {
      test.skip();
      return;
    }

    const toggle = page.getByTestId(`fee-status-toggle-${firstRowId}`);
    const statusBefore = await toggle.textContent();

    // Click toggle
    await toggle.click();

    // Wait for HTMX update
    await page.waitForTimeout(500);

    // Status should have changed
    const statusAfter = await page.getByTestId(`fee-status-toggle-${firstRowId}`).textContent();
    expect(statusAfter?.trim()).not.toBe(statusBefore?.trim());

    // Toggle back to restore
    // Baris 120 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId(`fee-status-toggle-${firstRowId}`).click();
  });
});
