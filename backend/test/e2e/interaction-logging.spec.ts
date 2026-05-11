import { test, expect } from '@playwright/test';

// Baris 4 digunakan untuk: Mengelompokkan skenario pengujian tentang "Admin Interaction Logging"
test.describe('Admin Interaction Logging', () => {
  // Baris 6 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Login as consultant (who can log interactions)
    // Baris 9 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Baris 14 digunakan untuk: Mengelompokkan skenario pengujian tentang "Interaction Form Navigation"
  test.describe('Interaction Form Navigation', () => {
    // Baris 16 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to interaction form from candidate detail"
    test('should navigate to interaction form from candidate detail', async ({ page }) => {
      // Go to candidates list
      // Baris 19 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on the first candidate's detail link
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();

      // Only run if there are candidates
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL
        const url = page.url();
        const candidateId = url.split('/').pop();

        // Navigate to interaction form
        // Baris 36 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify interaction form page loaded
        // Baris 40 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Log Interaksi Baru')).toBeVisible();
        // Baris 42 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Channel Komunikasi')).toBeVisible();
        // Baris 44 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Respon Kandidat')).toBeVisible();
      }
    });

    // Baris 49 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show back link to candidate detail"
    test('should show back link to candidate detail', async ({ page }) => {
      // Go to candidates list first
      // Baris 52 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL
        const url = page.url();
        const candidateId = url.split('/').pop();

        // Navigate to interaction form
        // Baris 67 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);
        // Baris 69 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Log Interaksi Baru')).toBeVisible();

        // Check back link exists and click it
        const backLink = page.locator(`a[href="/admin/candidates/${candidateId}"]`).first();
        // Baris 74 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(backLink).toBeVisible();
        await backLink.click();

        // Verify navigation back to candidate detail
        await page.waitForURL(new RegExp(`/admin/candidates/${candidateId}$`));
      }
    });
  });

  // Baris 84 digunakan untuk: Mengelompokkan skenario pengujian tentang "Interaction Form Elements"
  test.describe('Interaction Form Elements', () => {
    // Baris 86 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display all channel options"
    test('should display all channel options', async ({ page }) => {
      // Go to candidates list
      // Baris 89 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 102 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify all channel radio options are present
        // Baris 106 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(page.locator('input[name="channel"][value="call"]')).toBeAttached();
        // Baris 108 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(page.locator('input[name="channel"][value="whatsapp"]')).toBeAttached();
        // Baris 110 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(page.locator('input[name="channel"][value="email"]')).toBeAttached();
        // Baris 112 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(page.locator('input[name="channel"][value="campus_visit"]')).toBeAttached();
        // Baris 114 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(page.locator('input[name="channel"][value="home_visit"]')).toBeAttached();
      }
    });

    // Baris 119 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display category options from database"
    test('should display category options from database', async ({ page }) => {
      // Go to candidates list
      // Baris 122 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 135 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify category radio options are present (from database)
        // Baris 139 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(page.locator('input[name="category"]').first()).toBeAttached();
      }
    });

    // Baris 144 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display obstacle dropdown"
    test('should display obstacle dropdown', async ({ page }) => {
      // Go to candidates list
      // Baris 147 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 160 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify obstacle dropdown is present
        // Baris 164 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('select[name="obstacle"]')).toBeVisible();
      }
    });

    // Baris 169 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display remarks textarea"
    test('should display remarks textarea', async ({ page }) => {
      // Go to candidates list
      // Baris 172 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 185 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify remarks textarea is present and required
        const remarksField = page.locator('textarea[name="remarks"]');
        // Baris 190 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(remarksField).toBeVisible();
        // Baris 192 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(remarksField).toHaveAttribute('required');
      }
    });

    // Baris 197 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display next followup date field"
    test('should display next followup date field', async ({ page }) => {
      // Go to candidates list
      // Baris 200 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 213 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify next followup date field is present
        // Baris 217 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('input[name="next_followup_date"]')).toBeVisible();
      }
    });

    // Baris 222 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display candidate summary info"
    test('should display candidate summary info', async ({ page }) => {
      // Go to candidates list
      // Baris 225 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 238 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify candidate summary is displayed
        // Baris 242 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Kandidat:')).toBeVisible();
        // Baris 244 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('.bg-gray-50 >> text=Nama')).toBeVisible();
        // Baris 246 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('.bg-gray-50 >> text=Status')).toBeVisible();
      }
    });

    // Baris 251 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display submit buttons"
    test('should display submit buttons', async ({ page }) => {
      // Go to candidates list
      // Baris 254 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 267 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Verify submit buttons
        // Baris 271 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('button[value="save"]')).toBeVisible();
        // Baris 273 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('button[value="save_and_next"]')).toBeVisible();
      }
    });
  });

  // Baris 279 digunakan untuk: Mengelompokkan skenario pengujian tentang "Interaction Form Submission"
  test.describe('Interaction Form Submission', () => {
    // Baris 281 digunakan untuk: Memulai eksekusi pengujian dengan judul "should require channel, category, and remarks"
    test('should require channel, category, and remarks', async ({ page }) => {
      // Go to candidates list
      // Baris 284 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL and navigate to interaction form
        const url = page.url();
        const candidateId = url.split('/').pop();
        // Baris 297 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Try to submit without required fields
        await page.click('button[value="save"]');

        // Form should not navigate away (HTML5 validation)
        // Baris 304 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
        await expect(page).toHaveURL(new RegExp(`/admin/candidates/${candidateId}/interaction`));
      }
    });

    // Baris 309 digunakan untuk: Memulai eksekusi pengujian dengan judul "should submit interaction and redirect to candidate detail"
    test('should submit interaction and redirect to candidate detail', async ({ page }) => {
      // Go to candidates list
      // Baris 312 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL
        const url = page.url();
        const candidateId = url.split('/').pop();

        // Navigate to interaction form
        // Baris 327 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);
        // Baris 329 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Log Interaksi Baru')).toBeVisible();

        // Fill required fields
        // Select channel (click on label containing the hidden radio)
        await page.click('label:has(input[name="channel"][value="whatsapp"])');

        // Select category (click the label containing the first category radio)
        await page.click('label:has(input[name="category"]):first-of-type');

        // Fill remarks with unique text for verification
        const uniqueRemarks = `E2E Test interaction at ${Date.now()} - kandidat tertarik dengan program studi.`;
        await page.fill('textarea[name="remarks"]', uniqueRemarks);

        // Submit the form
        await page.click('button[value="save"]');

        // Should redirect to candidate detail page
        await page.waitForURL(new RegExp(`/admin/candidates/${candidateId}$`), { timeout: 10000 });

        // Verify we're on the candidate detail page
        // Baris 350 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Timeline Interaksi')).toBeVisible();

        // Verify the interaction appears in the timeline
        // Baris 354 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator(`text=${uniqueRemarks.substring(0, 30)}`)).toBeVisible();
      }
    });

    // Baris 359 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist interaction after page reload"
    test('should persist interaction after page reload', async ({ page }) => {
      // Go to candidates list
      // Baris 362 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL
        const url = page.url();
        const candidateId = url.split('/').pop();

        // Navigate to interaction form
        // Baris 377 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);
        // Baris 379 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Log Interaksi Baru')).toBeVisible();

        // Fill required fields
        await page.click('label:has(input[name="channel"][value="call"])');
        await page.click('label:has(input[name="category"]):first-of-type');

        // Fill remarks with unique text for verification
        const uniqueRemarks = `Persistence test ${Date.now()} - follow up via telepon.`;
        await page.fill('textarea[name="remarks"]', uniqueRemarks);

        // Set next followup date
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const dateStr = nextWeek.toISOString().split('T')[0];
        await page.fill('input[name="next_followup_date"]', dateStr);

        // Submit the form
        await page.click('button[value="save"]');

        // Wait for redirect
        await page.waitForURL(new RegExp(`/admin/candidates/${candidateId}$`), { timeout: 10000 });

        // Reload the page
        await page.reload();

        // Verify the interaction still appears after reload (persisted to database)
        // Baris 406 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Timeline Interaksi')).toBeVisible();
        // Baris 408 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator(`text=${uniqueRemarks.substring(0, 20)}`)).toBeVisible();
      }
    });

    // Baris 413 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display channel badge in timeline after submission"
    test('should display channel badge in timeline after submission', async ({ page }) => {
      // Go to candidates list
      // Baris 416 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await page.waitForSelector('[data-testid="candidates-page"]');

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Get candidate ID from URL
        const url = page.url();
        const candidateId = url.split('/').pop();

        // Navigate to interaction form
        // Baris 431 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
        await page.goto(`/admin/candidates/${candidateId}/interaction`);

        // Fill required fields - use email channel
        await page.click('label:has(input[name="channel"][value="email"])');
        await page.click('label:has(input[name="category"]):first-of-type');

        const uniqueRemarks = `Email channel test ${Date.now()}`;
        await page.fill('textarea[name="remarks"]', uniqueRemarks);

        // Submit the form
        await page.click('button[value="save"]');

        // Wait for redirect
        await page.waitForURL(new RegExp(`/admin/candidates/${candidateId}$`), { timeout: 10000 });

        // Verify channel badge appears (email icon or text)
        // Baris 448 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator('text=Timeline Interaksi')).toBeVisible();
        // The timeline should show the email channel
        // Baris 451 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.locator(`text=${uniqueRemarks.substring(0, 15)}`)).toBeVisible();
      }
    });
  });

  // Baris 457 digunakan untuk: Mengelompokkan skenario pengujian tentang "Error Handling"
  test.describe('Error Handling', () => {
    // Baris 459 digunakan untuk: Memulai eksekusi pengujian dengan judul "should return 404 for non-existent candidate"
    test('should return 404 for non-existent candidate', async ({ page }) => {
      // Baris 461 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/00000000-0000-0000-0000-000000000000/interaction"
      const response = await page.goto('/admin/candidates/00000000-0000-0000-0000-000000000000/interaction');
      expect(response?.status()).toBe(404);
    });

    // Baris 466 digunakan untuk: Memulai eksekusi pengujian dengan judul "should return error for invalid UUID"
    test('should return error for invalid UUID', async ({ page }) => {
      // Baris 468 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/invalid-id/interaction"
      const response = await page.goto('/admin/candidates/invalid-id/interaction');
      // Should either return 404 or 500 depending on how database handles invalid UUID
      expect([404, 500]).toContain(response?.status());
    });
  });
});
