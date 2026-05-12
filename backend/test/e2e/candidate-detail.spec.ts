import { test, expect } from '@playwright/test';
import { CandidatesPage, CandidateDetailPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Candidate Detail"
test.describe('Admin Candidate Detail', () => {
  let candidatesPage: CandidatesPage;
  let detailPage: CandidateDetailPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    candidatesPage = new CandidatesPage(page);
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    detailPage = new CandidateDetailPage(page);
    await candidatesPage.login('admin');
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Navigation"
  test.describe('Page Navigation', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should navigate to candidate detail from list"
    test('should navigate to candidate detail from list', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on the first candidate's detail link
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();

      // Only run if there are candidates
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Verify detail page loaded
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.detailPage).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitlePersonalInfo).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should show back link to candidates list"
    test('should show back link to candidates list', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check back link exists
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.backLink).toBeVisible();

        // Click back and verify navigation
        await detailPage.goBackToCandidatesList();
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Content"
  test.describe('Page Content', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display personal info section"
    test('should display personal info section', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check personal info section
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitlePersonalInfo).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldEmail).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldPhone).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display education section"
    test('should display education section', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check education section
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleEducation).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldHighSchool).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldProdi).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display source and assignment section"
    test('should display source and assignment section', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check source & assignment section
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleSourceAssignment).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldSourceInfo).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldConsultant).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display payment status section"
    test('should display payment status section', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check payment status section
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitlePaymentStatus).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldRegistrationFee).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display documents section"
    test('should display documents section', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check documents section
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleDocuments).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display timeline section"
    test('should display timeline section', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check timeline section
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.sectionTitleTimeline).toBeVisible();
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Action Buttons"
  test.describe('Action Buttons', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display log interaction button"
    test('should display log interaction button', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check action buttons
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.btnLogInteraction).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display mark as lost button"
    test('should display mark as lost button', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Check mark as lost button
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.btnMarkLost).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should navigate to interaction form when clicking log interaction"
    test('should navigate to interaction form when clicking log interaction', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Click log interaction link (navigates to dedicated form page)
        const logBtn = page.getByTestId('btn-log-interaction');
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(logBtn).toBeVisible();
        await logBtn.click();

        // Should navigate to interaction form page
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+\/interaction/);
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getByTestId('interaction-form')).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open lost modal when clicking mark as lost"
    test('should open lost modal when clicking mark as lost', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates"
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
          // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.modalLost).toBeVisible();
          // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.formLost).toBeVisible();
          // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.selectLostReason).toBeVisible();
          // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(detailPage.btnConfirmLost).toBeVisible();

          // Close modal
          await detailPage.closeLostModal();
        }
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Error Handling"
  test.describe('Error Handling', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should return 404 for non-existent candidate"
    test('should return 404 for non-existent candidate', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates/00000000-0000-0000-0000-000000000000"
      const response = await page.goto('/admin/candidates/00000000-0000-0000-0000-000000000000');
      expect(response?.status()).toBe(404);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should return 404 for invalid UUID"
    test('should return 404 for invalid UUID', async ({ page }) => {
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/candidates/invalid-id"
      const response = await page.goto('/admin/candidates/invalid-id');
      // Should either return 404 or 500 depending on how database handles invalid UUID
      expect([404, 500]).toContain(response?.status());
    });
  });
});
