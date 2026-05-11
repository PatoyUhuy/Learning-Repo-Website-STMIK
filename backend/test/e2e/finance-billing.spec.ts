import { test, expect, Browser, Page } from '@playwright/test';

// Helper to create a candidate for billing tests
async function setupCandidateForBilling(browser: Browser): Promise<{ candidateId: string; candidateEmail: string; page: Page }> {
  const candidatePage = await browser.newPage();
  const uniqueId = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  const uniqueEmail = `billing${uniqueId}@example.com`;
  const password = 'testpassword123';

  // Step 1: Account creation
  await candidatePage.goto('/register');
  await candidatePage.getByTestId('input-email').fill(uniqueEmail);
  await candidatePage.getByTestId('input-password').fill(password);
  await candidatePage.getByTestId('input-password-confirm').fill(password);
  await candidatePage.getByTestId('btn-submit-step1').click();
  // Baris 17 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step2-form')).toBeVisible({ timeout: 10000 });

  // Step 2: Personal info
  await candidatePage.getByTestId('input-name').fill(`BillingTest ${uniqueId}`);
  await candidatePage.getByTestId('input-address').fill('Test Address');
  await candidatePage.getByTestId('input-city').fill('Jakarta');
  await candidatePage.getByTestId('input-province').fill('DKI Jakarta');
  await candidatePage.getByTestId('btn-submit-step2').click();
  // Baris 26 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step3-form')).toBeVisible({ timeout: 10000 });

  // Step 3: Education
  await candidatePage.getByTestId('input-high-school').fill('SMA Test');
  await candidatePage.getByTestId('select-graduation-year').selectOption('2025');
  const prodiRadios = candidatePage.locator('input[type="radio"][name="prodi_id"]');
  await prodiRadios.first().click();
  await candidatePage.getByTestId('btn-submit-step3').click();
  // Baris 35 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step4-form')).toBeVisible({ timeout: 10000 });

  // Step 4: Source tracking - complete registration
  await candidatePage.getByTestId('select-source-type').selectOption('instagram');
  await candidatePage.getByTestId('btn-submit-step4').click();
  // Baris 41 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
  await expect(candidatePage).toHaveURL('/portal', { timeout: 10000 });

  await candidatePage.close();

  // Login as admin to get candidate ID
  const adminPage = await browser.newPage();
  await adminPage.goto('/test/login/admin');
  await adminPage.goto('/admin/candidates?search=' + encodeURIComponent(uniqueEmail));
  // Baris 50 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
  await expect(adminPage.getByTestId('candidates-page')).toBeVisible();
  await adminPage.waitForTimeout(1000);

  // Get candidate ID
  const viewLink = adminPage.locator('[data-testid^="view-candidate-"]').first();
  const testId = await viewLink.getAttribute('data-testid');
  const candidateId = testId?.replace('view-candidate-', '') || '';

  return { candidateId, candidateEmail: uniqueEmail, page: adminPage };
}

// Baris 62 digunakan untuk: Mengelompokkan skenario pengujian tentang "Finance Billing Management"
test.describe('Finance Billing Management', () => {
  // Baris 64 digunakan untuk: Mengelompokkan skenario pengujian tentang "Billing List"
  test.describe('Billing List', () => {
    // Baris 66 digunakan untuk: Memulai eksekusi pengujian dengan judul "finance user can access billing list page"
    test('finance user can access billing list page', async ({ browser }) => {
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto('/admin/finance/billings');

      // Baris 72 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(financePage.getByTestId('finance-billings-page')).toBeVisible();
      // Baris 74 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(financePage.getByTestId('stat-unpaid')).toBeVisible();
      // Baris 76 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(financePage.getByTestId('stat-pending')).toBeVisible();
      // Baris 78 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(financePage.getByTestId('stat-paid')).toBeVisible();
      // Baris 80 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(financePage.getByTestId('billings-table')).toBeVisible();

      await financePage.close();
    });

    // Baris 86 digunakan untuk: Memulai eksekusi pengujian dengan judul "admin can also access billing list page"
    test('admin can also access billing list page', async ({ browser }) => {
      const adminPage = await browser.newPage();
      await adminPage.goto('/test/login/admin');
      await adminPage.goto('/admin/finance/billings');

      // Baris 92 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(adminPage.getByTestId('finance-billings-page')).toBeVisible();

      await adminPage.close();
    });

    // Baris 98 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant cannot access billing list page"
    test('consultant cannot access billing list page', async ({ browser }) => {
      const consultantPage = await browser.newPage();
      await consultantPage.goto('/test/login/consultant');

      const response = await consultantPage.goto('/admin/finance/billings');
      expect(response?.status()).toBe(403);

      await consultantPage.close();
    });
  });

  // Baris 110 digunakan untuk: Mengelompokkan skenario pengujian tentang "Create Billing"
  test.describe('Create Billing', () => {
    // Baris 112 digunakan untuk: Memulai eksekusi pengujian dengan judul "finance user can create billing for candidate"
    test('finance user can create billing for candidate', async ({ browser }) => {
      const { candidateId, candidateEmail, page: adminPage } = await setupCandidateForBilling(browser);
      await adminPage.close();

      // Login as finance
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');

      // Go to create billing form with candidate pre-selected
      await financePage.goto(`/admin/finance/billings/create?candidate_id=${candidateId}`);
      // Baris 123 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(financePage.getByTestId('billing-form-page')).toBeVisible();

      // Fill billing form
      await financePage.getByTestId('select-billing-type').selectOption('tuition');
      await financePage.getByTestId('input-amount').fill('5000000');
      await financePage.getByTestId('input-due-date').fill('2026-03-01');
      await financePage.getByTestId('input-description').fill('Biaya Kuliah Semester 1');

      // Submit
      await financePage.getByTestId('btn-submit').click();

      // Should redirect to billing detail
      // Baris 136 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(financePage.getByTestId('billing-detail-page')).toBeVisible({ timeout: 10000 });
      // Baris 138 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(financePage.getByTestId('billing-type')).toContainText('Biaya Kuliah');
      // Baris 140 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(financePage.getByTestId('billing-amount')).toContainText('5.000.000');

      await financePage.close();
    });

    // Baris 146 digunakan untuk: Memulai eksekusi pengujian dengan judul "billing form validates required fields"
    test('billing form validates required fields', async ({ browser }) => {
      const { candidateId, page: adminPage } = await setupCandidateForBilling(browser);
      await adminPage.close();

      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto(`/admin/finance/billings/create?candidate_id=${candidateId}`);

      // Try to submit without billing type
      await financePage.getByTestId('input-amount').fill('1000000');
      await financePage.getByTestId('btn-submit').click();

      // Should show validation (HTML5 required)
      const typeSelect = financePage.getByTestId('select-billing-type');
      const isInvalid = await typeSelect.evaluate((el: HTMLSelectElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();

      await financePage.close();
    });
  });

  // Baris 168 digunakan untuk: Mengelompokkan skenario pengujian tentang "Edit Billing"
  test.describe('Edit Billing', () => {
    // Baris 170 digunakan untuk: Memulai eksekusi pengujian dengan judul "finance user can edit unpaid billing"
    test('finance user can edit unpaid billing', async ({ browser }) => {
      const { candidateId, page: adminPage } = await setupCandidateForBilling(browser);
      await adminPage.close();

      // Create a billing first
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto(`/admin/finance/billings/create?candidate_id=${candidateId}`);

      await financePage.getByTestId('select-billing-type').selectOption('registration');
      await financePage.getByTestId('input-amount').fill('500000');
      await financePage.getByTestId('btn-submit').click();

      // Baris 184 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(financePage.getByTestId('billing-detail-page')).toBeVisible({ timeout: 10000 });

      // Edit the billing
      await financePage.getByTestId('edit-amount').fill('600000');
      await financePage.getByTestId('edit-description').fill('Updated description');
      await financePage.getByTestId('btn-update').click();

      // Should show success message
      // Baris 193 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(financePage.getByTestId('success-message')).toBeVisible({ timeout: 5000 });
      // Baris 195 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
      await expect(financePage.getByTestId('billing-amount')).toContainText('600.000');

      await financePage.close();
    });

    // Baris 201 digunakan untuk: Memulai eksekusi pengujian dengan judul "finance user can cancel unpaid billing"
    test('finance user can cancel unpaid billing', async ({ browser }) => {
      const { candidateId, page: adminPage } = await setupCandidateForBilling(browser);
      await adminPage.close();

      // Create a billing first
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto(`/admin/finance/billings/create?candidate_id=${candidateId}`);

      await financePage.getByTestId('select-billing-type').selectOption('dormitory');
      await financePage.getByTestId('input-amount').fill('1500000');
      await financePage.getByTestId('btn-submit').click();

      // Baris 215 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(financePage.getByTestId('billing-detail-page')).toBeVisible({ timeout: 10000 });

      // Cancel the billing
      financePage.on('dialog', dialog => dialog.accept());
      await financePage.getByTestId('btn-cancel-billing').click();

      // Should redirect to billings list
      // Baris 223 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(financePage.getByTestId('finance-billings-page')).toBeVisible({ timeout: 10000 });

      await financePage.close();
    });
  });

  // Baris 230 digunakan untuk: Mengelompokkan skenario pengujian tentang "Billing Filters"
  test.describe('Billing Filters', () => {
    // Baris 232 digunakan untuk: Memulai eksekusi pengujian dengan judul "finance user can filter billings by status"
    test('finance user can filter billings by status', async ({ browser }) => {
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto('/admin/finance/billings');

      // Filter by unpaid status
      await financePage.getByTestId('select-status').selectOption('unpaid');
      await financePage.getByTestId('btn-filter').click();

      // URL should contain status filter
      // Baris 243 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(financePage).toHaveURL(/status=unpaid/);

      await financePage.close();
    });

    // Baris 249 digunakan untuk: Memulai eksekusi pengujian dengan judul "finance user can filter billings by type"
    test('finance user can filter billings by type', async ({ browser }) => {
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto('/admin/finance/billings');

      // Filter by tuition type
      await financePage.getByTestId('select-type').selectOption('tuition');
      await financePage.getByTestId('btn-filter').click();

      // URL should contain type filter
      // Baris 260 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(financePage).toHaveURL(/type=tuition/);

      await financePage.close();
    });

    // Baris 266 digunakan untuk: Memulai eksekusi pengujian dengan judul "finance user can search billings by candidate"
    test('finance user can search billings by candidate', async ({ browser }) => {
      const financePage = await browser.newPage();
      await financePage.goto('/test/login/finance');
      await financePage.goto('/admin/finance/billings');

      // Search by name
      await financePage.getByTestId('input-search').fill('BillingTest');
      await financePage.getByTestId('btn-filter').click();

      // URL should contain search filter
      // Baris 277 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(financePage).toHaveURL(/search=BillingTest/);

      await financePage.close();
    });
  });
});
