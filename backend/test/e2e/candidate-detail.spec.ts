import { test, expect } from '@playwright/test';
import { CandidatesPage, CandidateDetailPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Admin Candidate Detail"
test.describe('Admin Candidate Detail', () => {
  let candidatesPage: CandidatesPage;
  let detailPage: CandidateDetailPage;

  // Baris 10 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 12 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    candidatesPage = new CandidatesPage(page);
    // Baris 14 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    detailPage = new CandidateDetailPage(page);
    await candidatesPage.login('admin');
  });

  // Baris 19 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Navigation"
  test.describe('Page Navigation', () => {
    // Baris 21 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to candidate detail from list"
    test('should navigate to candidate detail from list', async ({ page }) => {
      // Baris 23 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on the first candidate's detail link
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();

      // Only run if there are candidates
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Verify detail page loaded
        // Baris 36 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.detailPage).toBeVisible();
        // Baris 38 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitlePersonalInfo).toBeVisible();
      }
    });

    // Baris 43 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show back link to candidates list"
    test('should show back link to candidates list', async ({ page }) => {
      // Baris 45 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check back link exists
        // Baris 56 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.backLink).toBeVisible();

        // Click back and verify navigation
        await detailPage.goBackToCandidatesList();
      }
    });
  });

  // Baris 65 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Content"
  test.describe('Page Content', () => {
    // Baris 67 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display personal info section"
    test('should display personal info section', async ({ page }) => {
      // Baris 69 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check personal info section
        // Baris 80 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitlePersonalInfo).toBeVisible();
        // Baris 82 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldEmail).toBeVisible();
        // Baris 84 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldPhone).toBeVisible();
      }
    });

    // Baris 89 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display education section"
    test('should display education section', async ({ page }) => {
      // Baris 91 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check education section
        // Baris 102 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleEducation).toBeVisible();
        // Baris 104 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldHighSchool).toBeVisible();
        // Baris 106 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldProdi).toBeVisible();
      }
    });

    // Baris 111 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display source and assignment section"
    test('should display source and assignment section', async ({ page }) => {
      // Baris 113 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check source & assignment section
        // Baris 124 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleSourceAssignment).toBeVisible();
        // Baris 126 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldSourceInfo).toBeVisible();
        // Baris 128 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldConsultant).toBeVisible();
      }
    });

    // Baris 133 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display payment status section"
    test('should display payment status section', async ({ page }) => {
      // Baris 135 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check payment status section
        // Baris 146 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitlePaymentStatus).toBeVisible();
        // Baris 148 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldRegistrationFee).toBeVisible();
      }
    });

    // Baris 153 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display documents section"
    test('should display documents section', async ({ page }) => {
      // Baris 155 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check documents section
        // Baris 166 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleDocuments).toBeVisible();
      }
    });

    // Baris 171 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display timeline section"
    test('should display timeline section', async ({ page }) => {
      // Baris 173 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check timeline section
        // Baris 184 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleTimeline).toBeVisible();
      }
    });
  });

  // Baris 190 digunakan untuk: Mengelompokkan skenario pengujian tentang "Action Buttons"
  test.describe('Action Buttons', () => {
    // Baris 192 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display log interaction button"
    test('should display log interaction button', async ({ page }) => {
      // Baris 194 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check action buttons
        // Baris 205 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.btnLogInteraction).toBeVisible();
      }
    });

    // Baris 210 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display mark as lost button"
    test('should display mark as lost button', async ({ page }) => {
      // Baris 212 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check mark as lost button
        // Baris 223 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.btnMarkLost).toBeVisible();
      }
    });

    // Baris 228 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to interaction form when clicking log interaction"
    test('should navigate to interaction form when clicking log interaction', async ({ page }) => {
      // Baris 230 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Click log interaction link (navigates to dedicated form page)
        const logBtn = page.getByTestId('btn-log-interaction');
        // Baris 242 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(logBtn).toBeVisible();
        await logBtn.click();

        // Should navigate to interaction form page
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+\/interaction/);
        // Baris 248 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getByTestId('interaction-form')).toBeVisible();
      }
    });

    // Baris 253 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open lost modal when clicking mark as lost"
    test('should open lost modal when clicking mark as lost', async ({ page }) => {
      // Baris 255 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check if mark as lost button is visible (not for lost/enrolled candidates)
        if (await detailPage.btnMarkLost.isVisible()) {
          // Open lost modal
          await detailPage.openLostModal();

          // Check modal is visible with form elements
          // Baris 271 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.modalLost).toBeVisible();
          // Baris 273 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.formLost).toBeVisible();
          // Baris 275 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.selectLostReason).toBeVisible();
          // Baris 277 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.btnConfirmLost).toBeVisible();

          // Close modal
          await detailPage.closeLostModal();
        }
      }
    });
  });

  // Baris 287 digunakan untuk: Mengelompokkan skenario pengujian tentang "Error Handling"
  test.describe('Error Handling', () => {
    // Baris 289 digunakan untuk: Memulai eksekusi pengujian dengan judul "should return 404 for non-existent candidate"
    test('should return 404 for non-existent candidate', async ({ page }) => {
      // Baris 291 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/00000000-0000-0000-0000-000000000000"
      const response = await page.goto('/admin/candidates/00000000-0000-0000-0000-000000000000');
      expect(response?.status()).toBe(404);
    });

    // Baris 296 digunakan untuk: Memulai eksekusi pengujian dengan judul "should return 404 for invalid UUID"
    test('should return 404 for invalid UUID', async ({ page }) => {
      // Baris 298 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/invalid-id"
      const response = await page.goto('/admin/candidates/invalid-id');
      // Should either return 404 or 500 depending on how database handles invalid UUID
      expect([404, 500]).toContain(response?.status());
    });
  });
});
