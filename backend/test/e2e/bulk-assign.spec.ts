import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Bulk EC Assignment"
test.describe('Bulk EC Assignment', () => {
  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-page')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display checkboxes for admin users"
  test('should display checkboxes for admin users', async ({ page }) => {
    // Admin should see select-all checkbox
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('#select-all')).toBeVisible();
    // Each candidate row should have a checkbox
    const checkboxes = page.locator('.candidate-checkbox');
    const count = await checkboxes.count();
    if (count > 0) {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(checkboxes.first()).toBeVisible();
    }
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should show bulk action bar when candidates are selected"
  test('should show bulk action bar when candidates are selected', async ({ page }) => {
    const checkboxes = page.locator('.candidate-checkbox');
    const count = await checkboxes.count();
    if (count === 0) {
      test.skip();
      return;
    }

    // Initially bulk action bar should be hidden
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('#bulk-action-bar')).toBeHidden();

    // Select first candidate
    await checkboxes.first().check();

    // Bulk action bar should appear
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('#bulk-action-bar')).toBeVisible();
    // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.locator('#bulk-count')).toContainText('1 kandidat dipilih');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should select all candidates with select-all checkbox"
  test('should select all candidates with select-all checkbox', async ({ page }) => {
    const checkboxes = page.locator('.candidate-checkbox');
    const count = await checkboxes.count();
    if (count === 0) {
      test.skip();
      return;
    }

    await page.locator('#select-all').check();

    // All checkboxes should be checked
    for (let i = 0; i < count; i++) {
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(checkboxes.nth(i)).toBeChecked();
    }

    // Bulk action bar should show correct count
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('#bulk-action-bar')).toBeVisible();
    // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.locator('#bulk-count')).toContainText(`${count} kandidat dipilih`);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should clear selection with cancel button"
  test('should clear selection with cancel button', async ({ page }) => {
    const checkboxes = page.locator('.candidate-checkbox');
    const count = await checkboxes.count();
    if (count === 0) {
      test.skip();
      return;
    }

    // Select all
    await page.locator('#select-all').check();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('#bulk-action-bar')).toBeVisible();

    // Click cancel
    // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.locator('#bulk-cancel-btn').click();

    // Bar should be hidden, all unchecked
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('#bulk-action-bar')).toBeHidden();
    for (let i = 0; i < count; i++) {
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(checkboxes.nth(i)).not.toBeChecked();
    }
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display EC options in bulk assign dropdown"
  test('should display EC options in bulk assign dropdown', async ({ page }) => {
    const checkboxes = page.locator('.candidate-checkbox');
    const count = await checkboxes.count();
    if (count === 0) {
      test.skip();
      return;
    }

    // Select a candidate to reveal the bulk action bar
    await checkboxes.first().check();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('#bulk-action-bar')).toBeVisible();

    const select = page.locator('#bulk-consultant-select');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(select).toBeVisible();
    // Should have at least the placeholder option
    const options = select.locator('option');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should disable assign button when no EC selected"
  test('should disable assign button when no EC selected', async ({ page }) => {
    const checkboxes = page.locator('.candidate-checkbox');
    const count = await checkboxes.count();
    if (count === 0) {
      test.skip();
      return;
    }

    await checkboxes.first().check();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('#bulk-action-bar')).toBeVisible();

    // Assign button should be disabled when no EC selected
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('#bulk-assign-btn')).toBeDisabled();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display "Belum Ditugaskan" filter option"
  test('should display "Belum Ditugaskan" filter option', async ({ page }) => {
    const filterConsultant = page.getByTestId('filter-consultant');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(filterConsultant).toBeVisible();
    const unassignedOption = filterConsultant.locator('option[value="unassigned"]');
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(unassignedOption).toHaveText('Belum Ditugaskan');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant should NOT see checkboxes"
  test('consultant should NOT see checkboxes', async ({ page }) => {
    // Login as consultant instead
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidates-page')).toBeVisible();

    // Should NOT have select-all checkbox
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('#select-all')).toHaveCount(0);
  });
});
