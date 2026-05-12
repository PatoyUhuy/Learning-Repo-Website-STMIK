import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Interaction Logging Fix"
test.describe('Interaction Logging Fix', () => {
  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should navigate to dedicated interaction form from candidate detail"
  test('should navigate to dedicated interaction form from candidate detail', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    await page.waitForSelector('[data-testid="candidates-page"]');

    const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
    if (!(await detailLink.isVisible())) {
      test.skip();
      return;
    }

    await detailLink.click();
    await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

    // Log Interaksi button should be a link (not a modal trigger)
    const logBtn = page.getByTestId('btn-log-interaction');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(logBtn).toBeVisible();

    // Should be an <a> tag linking to the interaction form page
    const tagName = await logBtn.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('a');

    // Click and verify navigation to interaction form page
    await logBtn.click();
    await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+\/interaction/);
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('interaction-form')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should NOT have broken modal on candidate detail page"
  test('should NOT have broken modal on candidate detail page', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    await page.waitForSelector('[data-testid="candidates-page"]');

    const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
    if (!(await detailLink.isVisible())) {
      test.skip();
      return;
    }

    await detailLink.click();
    await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

    // The old broken modal should NOT exist
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('#modal-interaksi')).toHaveCount(0);
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.getByTestId('modal-interaction')).toHaveCount(0);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should submit interaction form and show in timeline"
  test('should submit interaction form and show in timeline', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    await page.waitForSelector('[data-testid="candidates-page"]');

    const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
    if (!(await detailLink.isVisible())) {
      test.skip();
      return;
    }

    await detailLink.click();
    await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

    const url = page.url();
    const candidateId = url.split('/').pop();

    // Navigate to interaction form
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
    await page.goto(`/admin/candidates/${candidateId}/interaction`);
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('interaction-form')).toBeVisible();

    // Fill form
    await page.click('label:has(input[name="channel"][value="whatsapp"])');
    await page.click('label:has(input[name="category"]):first-of-type');

    const uniqueRemarks = `Fix verification test ${Date.now()} - testing form submission works correctly.`;
    await page.fill('textarea[name="remarks"]', uniqueRemarks);

    // Submit
    await page.click('button[value="save"]');

    // Should redirect to candidate detail
    await page.waitForURL(new RegExp(`/admin/candidates/${candidateId}$`), { timeout: 10000 });

    // Verify timeline shows the interaction
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Timeline Interaksi')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator(`text=${uniqueRemarks.substring(0, 30)}`)).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should persist interaction after page reload"
  test('should persist interaction after page reload', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
    await page.goto('/admin/candidates');
    await page.waitForSelector('[data-testid="candidates-page"]');

    const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
    if (!(await detailLink.isVisible())) {
      test.skip();
      return;
    }

    await detailLink.click();
    await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

    const url = page.url();
    const candidateId = url.split('/').pop();

    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
    await page.goto(`/admin/candidates/${candidateId}/interaction`);
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('interaction-form')).toBeVisible();

    await page.click('label:has(input[name="channel"][value="call"])');
    await page.click('label:has(input[name="category"]):first-of-type');

    const uniqueRemarks = `Persistence check ${Date.now()} - this should survive a reload.`;
    await page.fill('textarea[name="remarks"]', uniqueRemarks);

    await page.click('button[value="save"]');
    await page.waitForURL(new RegExp(`/admin/candidates/${candidateId}$`), { timeout: 10000 });

    // Reload
    await page.reload();

    // Should still be visible
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator(`text=${uniqueRemarks.substring(0, 20)}`)).toBeVisible();
  });
});
