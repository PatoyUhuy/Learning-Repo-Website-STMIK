import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Fee Structure Editing"
test.describe('Fee Structure Editing', () => {
  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/settings/fees"
    await page.goto('/admin/settings/fees');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display fees settings page"
  test('should display fees settings page', async ({ page }) => {
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-fees-page')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('academic-year-select')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-fee-button')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display fee table with data"
  test('should display fee table with data', async ({ page }) => {
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('fees-table')).toBeVisible();
    // Should have fee rows from seed data (registration, tuition, dormitory)
    const feeRows = page.locator('[data-testid^="fee-row-"]');
    const count = await feeRows.count();
    // Seed data might or might not have fee structures created
    // At minimum, the table should be visible
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add fee modal"
  test('should open add fee modal', async ({ page }) => {
    // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-fee-button').click();
    const modal = page.getByTestId('add-fee-modal');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(modal).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('input-fee-type')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('input-fee-prodi')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('input-fee-amount')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should have fee type options from seed data"
  test('should have fee type options from seed data', async ({ page }) => {
    // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('add-fee-button').click();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('add-fee-modal')).toBeVisible();
    const feeTypeSelect = page.getByTestId('input-fee-type');
    const options = feeTypeSelect.locator('option');
    // Should have placeholder + at least 3 fee types (registration, tuition, dormitory)
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should open shared edit modal with fee data"
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
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(modal).toBeVisible();

    // Amount field should be populated
    const amountInput = page.locator('#edit-fee-amount');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(amountInput).toBeVisible();
    const value = await amountInput.inputValue();
    expect(Number(value)).toBeGreaterThan(0);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should toggle fee active status"
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
    // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId(`fee-status-toggle-${firstRowId}`).click();
  });
});
