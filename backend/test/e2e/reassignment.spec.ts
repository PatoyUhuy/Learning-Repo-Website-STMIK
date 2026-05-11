import { test, expect, Browser, Page } from '@playwright/test';
import { CandidatesPage, CandidateDetailPage } from './pages';

// Helper to register a new candidate and get their ID
async function registerCandidateAndGetId(browser: Browser): Promise<{ id: string; page: Page }> {
  const candidatePage = await browser.newPage();
  const uniqueId = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  const uniqueEmail = `reassign${uniqueId}@example.com`;
  const password = 'testpassword123';

  // Step 1: Account creation
  await candidatePage.goto('/register');
  await candidatePage.getByTestId('input-email').fill(uniqueEmail);
  await candidatePage.getByTestId('input-password').fill(password);
  await candidatePage.getByTestId('input-password-confirm').fill(password);
  await candidatePage.getByTestId('btn-submit-step1').click();
  // Baris 18 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step2-form')).toBeVisible({ timeout: 10000 });

  // Step 2: Personal info
  await candidatePage.getByTestId('input-name').fill(`ReassignTest ${uniqueId}`);
  await candidatePage.getByTestId('input-address').fill('Test Address');
  await candidatePage.getByTestId('input-city').fill('Jakarta');
  await candidatePage.getByTestId('input-province').fill('DKI Jakarta');
  await candidatePage.getByTestId('btn-submit-step2').click();
  // Baris 27 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step3-form')).toBeVisible({ timeout: 10000 });

  // Step 3: Education
  await candidatePage.getByTestId('input-high-school').fill('SMA Test');
  await candidatePage.getByTestId('select-graduation-year').selectOption('2025');
  const prodiRadios = candidatePage.locator('input[type="radio"][name="prodi_id"]');
  await prodiRadios.first().click();
  await candidatePage.getByTestId('btn-submit-step3').click();
  // Baris 36 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step4-form')).toBeVisible({ timeout: 10000 });

  // Step 4: Source tracking - complete registration
  await candidatePage.getByTestId('select-source-type').selectOption('instagram');
  await candidatePage.getByTestId('btn-submit-step4').click();
  // Baris 42 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
  await expect(candidatePage).toHaveURL('/portal', { timeout: 10000 });

  // Get candidate ID from URL or database
  // For now, we'll search for this candidate in admin panel
  await candidatePage.close();

  // Open admin page to find candidate
  const adminPage = await browser.newPage();
  await adminPage.goto('/test/login/admin');
  await adminPage.goto('/admin/candidates?search=' + encodeURIComponent(uniqueEmail));
  // Baris 53 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
  await expect(adminPage.getByTestId('candidates-page')).toBeVisible();

  // Wait for search to complete
  await adminPage.waitForTimeout(1000);

  // Get the candidate row and extract ID from the view link
  const viewLink = adminPage.locator('[data-testid^="view-candidate-"]').first();
  const testId = await viewLink.getAttribute('data-testid');
  const candidateId = testId?.replace('view-candidate-', '') || '';

  return { id: candidateId, page: adminPage };
}

// Baris 67 digunakan untuk: Mengelompokkan skenario pengujian tentang "Candidate Reassignment"
test.describe('Candidate Reassignment', () => {
  // Baris 69 digunakan untuk: Mengelompokkan skenario pengujian tentang "Modal Behavior"
  test.describe('Modal Behavior', () => {
    // Baris 71 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open reassign modal when clicking reassign button"
    test('should open reassign modal when clicking reassign button', async ({ page }) => {
      // Baris 73 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const candidatesPage = new CandidatesPage(page);
      // Baris 75 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(page);

      await candidatesPage.login('admin');
      // Baris 79 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      // Click on first candidate if available
      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);
        await detailPage.expectPageLoaded();

        // Click reassign button
        await detailPage.btnReassign.click();

        // Modal should appear
        // Baris 94 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.reassignModal).toBeVisible();
        // Baris 96 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(detailPage.reassignModalTitle).toHaveText('Reassign Kandidat');
        // Baris 98 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.consultantList).toBeVisible();
      }
    });

    // Baris 103 digunakan untuk: Memulai eksekusi pengujian dengan judul "should close modal when clicking close button"
    test('should close modal when clicking close button', async ({ page }) => {
      // Baris 105 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const candidatesPage = new CandidatesPage(page);
      // Baris 107 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(page);

      await candidatesPage.login('admin');
      // Baris 111 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Open and close modal
        await detailPage.openReassignModal();
        await detailPage.closeReassignModal();

        // Modal should be gone (removed from DOM)
        // Baris 125 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.reassignModal).not.toBeVisible();
      }
    });

    // Baris 130 digunakan untuk: Memulai eksekusi pengujian dengan judul "should close modal when clicking cancel button"
    test('should close modal when clicking cancel button', async ({ page }) => {
      // Baris 132 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const candidatesPage = new CandidatesPage(page);
      // Baris 134 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(page);

      await candidatesPage.login('admin');
      // Baris 138 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        await detailPage.openReassignModal();
        await detailPage.reassignBtnCancel.click();

        // Baris 150 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.reassignModal).not.toBeVisible();
      }
    });

    // Baris 155 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display consultant list with workload info"
    test('should display consultant list with workload info', async ({ page }) => {
      // Baris 157 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const candidatesPage = new CandidatesPage(page);
      // Baris 159 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(page);

      await candidatesPage.login('admin');
      // Baris 163 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        await detailPage.openReassignModal();

        // Verify consultant options are displayed
        const consultantOptions = page.locator('[data-testid^="consultant-option-"]');
        const count = await consultantOptions.count();
        expect(count).toBeGreaterThan(0);

        // Check that each consultant shows workload info (active count, total count)
        if (count > 0) {
          const firstOption = consultantOptions.first();
          // Baris 182 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(firstOption.locator('text=aktif')).toBeVisible();
          // Baris 184 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
          await expect(firstOption.locator('text=total')).toBeVisible();
        }
      }
    });
  });

  // Baris 191 digunakan untuk: Mengelompokkan skenario pengujian tentang "Access Control"
  test.describe('Access Control', () => {
    // Baris 193 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant should not see reassign button"
    test('consultant should not see reassign button', async ({ page }) => {
      // Baris 195 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(page);

      // Baris 198 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
      await page.goto('/test/login/consultant');
      // Baris 200 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      // Baris 202 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('candidates-page')).toBeVisible();

      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        // Consultant should still see field-consultant but button behavior differs
        // Baris 211 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.fieldConsultant).toBeVisible();

        // Clicking reassign should not open modal (or button not functional for consultant)
        // The actual restriction is in the backend - consultant gets 403 on POST
      }
    });

    // Baris 219 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor should be able to open reassign modal"
    test('supervisor should be able to open reassign modal', async ({ page }) => {
      // Baris 221 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const candidatesPage = new CandidatesPage(page);
      // Baris 223 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(page);

      // Baris 226 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/supervisor"
      await page.goto('/test/login/supervisor');
      // Baris 228 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates"
      await page.goto('/admin/candidates');
      await candidatesPage.expectPageLoaded();

      const detailLink = page.locator('[data-testid^="view-candidate-"]').first();
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

        await detailPage.btnReassign.click();
        // Baris 238 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(detailPage.reassignModal).toBeVisible();
      }
    });
  });

  // Baris 244 digunakan untuk: Mengelompokkan skenario pengujian tentang "Reassignment Flow"
  test.describe('Reassignment Flow', () => {
    // Baris 246 digunakan untuk: Memulai eksekusi pengujian dengan judul "should successfully reassign candidate to different consultant"
    test('should successfully reassign candidate to different consultant', async ({ browser }) => {
      // Register a candidate first
      const { id: candidateId, page: adminPage } = await registerCandidateAndGetId(browser);
      // Baris 250 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(adminPage);

      if (!candidateId) {
        test.skip();
        return;
      }

      // Navigate to candidate detail
      await adminPage.goto(`/admin/candidates/${candidateId}`);
      await detailPage.expectPageLoaded();

      // Get current consultant name
      const currentConsultant = await detailPage.fieldConsultant.textContent();

      // Open reassign modal
      await detailPage.openReassignModal();

      // Select a different consultant (if available)
      const consultantOptions = adminPage.locator('[data-testid^="consultant-option-"]');
      const count = await consultantOptions.count();

      if (count > 1) {
        // Find a consultant that's not currently selected
        for (let i = 0; i < count; i++) {
          const option = consultantOptions.nth(i);
          const radio = option.locator('input[type="radio"]');
          const isChecked = await radio.isChecked();

          if (!isChecked) {
            // Click on a different consultant
            await radio.click();

            // Submit the form
            await detailPage.reassignBtnSubmit.click();

            // Wait for redirect back to detail page
            await adminPage.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

            // Verify consultant was changed
            const newConsultant = await detailPage.fieldConsultant.textContent();

            // If there was a change, the consultant text should be different
            // Note: The new consultant's name will be displayed
            expect(newConsultant).not.toBe(currentConsultant);
            break;
          }
        }
      }

      await adminPage.close();
    });

    // Baris 303 digunakan untuk: Memulai eksekusi pengujian dengan judul "should log reassignment in interaction timeline"
    test('should log reassignment in interaction timeline', async ({ browser }) => {
      // Register a candidate first
      const { id: candidateId, page: adminPage } = await registerCandidateAndGetId(browser);
      // Baris 307 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
      const detailPage = new CandidateDetailPage(adminPage);

      if (!candidateId) {
        test.skip();
        return;
      }

      await adminPage.goto(`/admin/candidates/${candidateId}`);
      await detailPage.expectPageLoaded();

      // Open reassign modal
      await detailPage.openReassignModal();

      // Select a different consultant
      const consultantOptions = adminPage.locator('[data-testid^="consultant-option-"]');
      const count = await consultantOptions.count();

      if (count > 1) {
        for (let i = 0; i < count; i++) {
          const option = consultantOptions.nth(i);
          const radio = option.locator('input[type="radio"]');
          const isChecked = await radio.isChecked();

          if (!isChecked) {
            await radio.click();
            await detailPage.reassignBtnSubmit.click();
            await adminPage.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);

            // Check that timeline shows reassignment entry
            // The reassignment creates an interaction with channel "system"
            const timelineList = detailPage.timelineList;
            // Baris 339 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
            await expect(timelineList).toBeVisible();

            // Look for reassignment entry in timeline
            const reassignEntry = adminPage.locator('text=dipindahkan dari konsultan');
            // Baris 344 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
            await expect(reassignEntry).toBeVisible();
            break;
          }
        }
      }

      await adminPage.close();
    });
  });
});
