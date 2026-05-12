import { test, expect, Page, Browser } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Create a test file for upload
function getTestFilePath(): string {
  const testFilesDir = path.join(__dirname, 'test-files-review');
  if (!fs.existsSync(testFilesDir)) {
    fs.mkdirSync(testFilesDir, { recursive: true });
  }
  const filePath = path.join(testFilesDir, 'test-review-doc.pdf');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '%PDF-1.4 Test Document for Review');
  }
  return filePath;
}

// Helper to register a new candidate and return their email and unique name
async function registerCandidate(browser: Browser): Promise<{ email: string; name: string; page: Page }> {
  const candidatePage = await browser.newPage();
  const uniqueId = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
  const uniqueEmail = `docreview${uniqueId}@example.com`;
  const uniqueName = `DocReviewCandidate ${uniqueId}`;
  const password = 'testpassword123';

  // Step 1: Account creation
  await candidatePage.goto('/register');
  await candidatePage.getByTestId('input-email').fill(uniqueEmail);
  await candidatePage.getByTestId('input-password').fill(password);
  await candidatePage.getByTestId('input-password-confirm').fill(password);
  await candidatePage.getByTestId('btn-submit-step1').click();
  // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step2-form')).toBeVisible({ timeout: 10000 });

  // Step 2: Personal info - use unique name
  await candidatePage.getByTestId('input-name').fill(uniqueName);
  await candidatePage.getByTestId('input-address').fill('Test Address');
  await candidatePage.getByTestId('input-city').fill('Jakarta');
  await candidatePage.getByTestId('input-province').fill('DKI Jakarta');
  await candidatePage.getByTestId('btn-submit-step2').click();
  // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step3-form')).toBeVisible({ timeout: 10000 });

  // Step 3: Education
  await candidatePage.getByTestId('input-high-school').fill('SMA Test');
  await candidatePage.getByTestId('select-graduation-year').selectOption('2025');
  // Click first prodi radio
  const prodiRadios = candidatePage.locator('input[type="radio"][name="prodi_id"]');
  await prodiRadios.first().click();
  await candidatePage.getByTestId('btn-submit-step3').click();
  // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(candidatePage.getByTestId('step4-form')).toBeVisible({ timeout: 10000 });

  // Step 4: Source tracking
  await candidatePage.getByTestId('select-source-type').selectOption('instagram');
  await candidatePage.getByTestId('btn-submit-step4').click();
  // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
  await expect(candidatePage).toHaveURL('/portal', { timeout: 10000 });

  return { email: uniqueEmail, name: uniqueName, page: candidatePage };
}

// Helper to upload a document
async function uploadDocument(page: Page): Promise<void> {
  // Kegunaan: Membuka browser dan menavigasi ke halaman "/portal/documents"
  await page.goto('/portal/documents');
  // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
  await expect(page.getByTestId('documents-page')).toBeVisible();

  // Find the first upload form
  const uploadForms = page.locator('form[action="/portal/documents/upload"]');
  const formCount = await uploadForms.count();
  expect(formCount).toBeGreaterThan(0);

  const firstForm = uploadForms.first();

  // Upload the file
  const fileInput = firstForm.locator('input[type="file"]');
  await fileInput.setInputFiles(getTestFilePath());

  const uploadButton = firstForm.locator('button[type="submit"]');
  await uploadButton.click();

  // Wait for page reload after upload
  await page.waitForLoadState('networkidle');

  // Verify upload succeeded - the form should now show "Menunggu Review" status
  // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
  await expect(page.locator('text=Menunggu Review').first()).toBeVisible({ timeout: 10000 });
}

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Document Review - Full Flow"
test.describe('Admin Document Review - Full Flow', () => {

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should upload document and verify it appears in admin review queue"
  test('should upload document and verify it appears in admin review queue', async ({ browser }) => {
    // Step 1: Register a new candidate
    const { email, name, page: candidatePage } = await registerCandidate(browser);

    // Step 2: Upload a document
    await uploadDocument(candidatePage);
    await candidatePage.close();

    // Step 3: Login as admin and verify document appears
    const adminPage = await browser.newPage();
    await adminPage.goto('/test/login/admin');
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(adminPage).toHaveURL('/admin');

    await adminPage.goto('/admin/documents?status=pending');

    // Verify the document from this candidate appears
    // Search by the unique candidate name
    await adminPage.locator('input[name="search"]').fill(email);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');

    // Should find the uploaded document with candidate name visible
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator(`text=${name}`).first()).toBeVisible();

    // Verify approve/reject buttons are available
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator('button:has-text("Setujui")').first()).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator('button:has-text("Tolak")').first()).toBeVisible();

    await adminPage.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should approve document and verify status changes"
  test('should approve document and verify status changes', async ({ browser }) => {
    // Step 1: Register a new candidate and upload document
    const { email, name, page: candidatePage } = await registerCandidate(browser);
    await uploadDocument(candidatePage);
    await candidatePage.close();

    // Step 2: Login as admin
    const adminPage = await browser.newPage();
    await adminPage.goto('/test/login/admin');

    // Search for the candidate's document using unique name
    await adminPage.goto('/admin/documents?status=pending');
    await adminPage.locator('input[name="search"]').fill(email);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');

    // Verify document is in pending queue
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator(`text=${name}`).first()).toBeVisible();

    // Step 3: Approve the document
    // Set up dialog handler before clicking
    adminPage.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    const approveButton = adminPage.locator('button:has-text("Setujui")').first();
    await approveButton.click();

    // Wait for redirect
    await adminPage.waitForLoadState('networkidle');
    expect(adminPage.url()).toContain('/admin/documents');

    // Step 4: Verify document moved to approved status
    await adminPage.goto('/admin/documents?status=approved');
    await adminPage.locator('input[name="search"]').fill(email);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');

    // Should find the document in approved list
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator(`text=${name}`).first()).toBeVisible();

    await adminPage.close();

    // Step 5: Verify candidate sees approved status
    const verifyPage = await browser.newPage();
    await verifyPage.goto('/login');
    await verifyPage.getByTestId('input-identifier').fill(email);
    await verifyPage.getByTestId('input-password').fill('testpassword123');
    await verifyPage.getByTestId('btn-login').click();
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(verifyPage).toHaveURL('/portal', { timeout: 10000 });

    await verifyPage.goto('/portal/documents');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(verifyPage.locator('text=Disetujui').first()).toBeVisible();

    await verifyPage.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should reject document with reason and verify status changes"
  test('should reject document with reason and verify status changes', async ({ browser }) => {
    // Step 1: Register a new candidate and upload document
    const { email, name, page: candidatePage } = await registerCandidate(browser);
    await uploadDocument(candidatePage);
    await candidatePage.close();

    // Step 2: Login as admin
    const adminPage = await browser.newPage();
    await adminPage.goto('/test/login/admin');

    // Search for the candidate's document using unique name
    await adminPage.goto('/admin/documents?status=pending');
    await adminPage.locator('input[name="search"]').fill(email);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');

    // Verify document is in pending queue
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator(`text=${name}`).first()).toBeVisible();

    // Step 3: Click reject to open modal
    const rejectButton = adminPage.locator('button:has-text("Tolak")').first();
    await rejectButton.click();

    // Modal should appear
    const modal = adminPage.locator('#reject-modal');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(modal).toBeVisible();

    // Select rejection reason
    const reasonSelect = modal.locator('select[name="rejection_reason"]');
    await reasonSelect.selectOption('blur');

    // Add notes
    const notesInput = modal.locator('textarea[name="rejection_notes"]');
    await notesInput.fill('Gambar tidak jelas, silakan upload ulang');

    // Submit rejection
    const submitButton = modal.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for redirect
    await adminPage.waitForLoadState('networkidle');
    expect(adminPage.url()).toContain('/admin/documents');

    // Step 4: Verify document moved to rejected status
    await adminPage.goto('/admin/documents?status=rejected');
    await adminPage.locator('input[name="search"]').fill(email);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');

    // Should find the document in rejected list with reason
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator(`text=${name}`).first()).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.locator('text=Gambar buram').first()).toBeVisible();

    await adminPage.close();

    // Step 5: Verify candidate sees rejected status with reason
    const verifyPage = await browser.newPage();
    await verifyPage.goto('/login');
    await verifyPage.getByTestId('input-identifier').fill(email);
    await verifyPage.getByTestId('input-password').fill('testpassword123');
    await verifyPage.getByTestId('btn-login').click();
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(verifyPage).toHaveURL('/portal', { timeout: 10000 });

    await verifyPage.goto('/portal/documents');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(verifyPage.locator('text=Ditolak').first()).toBeVisible();
    // Rejection reason should be visible
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(verifyPage.locator('text=buram').first()).toBeVisible();

    await verifyPage.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should verify uploaded file is accessible via URL"
  test('should verify uploaded file is accessible via URL', async ({ browser }) => {
    // Step 1: Register and upload document
    const { email, name, page: candidatePage } = await registerCandidate(browser);

    await candidatePage.goto('/portal/documents');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(candidatePage.getByTestId('documents-page')).toBeVisible();

    // Upload document
    const uploadForms = candidatePage.locator('form[action="/portal/documents/upload"]');
    expect(await uploadForms.count()).toBeGreaterThan(0);

    const firstForm = uploadForms.first();
    const fileInput = firstForm.locator('input[type="file"]');
    await fileInput.setInputFiles(getTestFilePath());
    await firstForm.locator('button[type="submit"]').click();
    await candidatePage.waitForLoadState('networkidle');

    await candidatePage.close();

    // Step 2: Login as admin and get the document URL
    const adminPage = await browser.newPage();
    await adminPage.goto('/test/login/admin');
    await adminPage.goto('/admin/documents?status=pending');

    // Search for our candidate using unique name
    await adminPage.locator('input[name="search"]').fill(email);
    await adminPage.keyboard.press('Enter');
    await adminPage.waitForLoadState('networkidle');

    // Find link to view the document
    const viewLink = adminPage.locator('a[href*="/uploads/"]').first();
    const hasViewLink = await viewLink.isVisible().catch(() => false);

    if (hasViewLink) {
      const fileUrl = await viewLink.getAttribute('href');
      expect(fileUrl).toContain('/uploads/');

      // Verify file is accessible
      const response = await adminPage.request.get(fileUrl!);
      expect(response.status()).toBe(200);
    }

    await adminPage.close();
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Document Review - Page Display"
test.describe('Admin Document Review - Page Display', () => {
  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
    await expect(page).toHaveURL('/admin');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should display document review page with stats"
  test('should display document review page with stats', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents"
    await page.goto('/admin/documents');

    // Stats cards should be visible
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('div').filter({ hasText: /^Menunggu Review$/ })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('div').filter({ hasText: /^Disetujui Hari Ini$/ })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('div').filter({ hasText: /^Ditolak Hari Ini$/ })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('div').filter({ hasText: /^Total Dokumen$/ })).toBeVisible();

    // Filter form should be visible
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('select[name="status"]')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('select[name="type"]')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('input[name="search"]')).toBeVisible();

    // Queue section should be visible
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Antrian Review Dokumen')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should filter by status via URL"
  test('should filter by status via URL', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents?status=approved"
    await page.goto('/admin/documents?status=approved');
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('select[name="status"]')).toHaveValue('approved');

    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents?status=rejected"
    await page.goto('/admin/documents?status=rejected');
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('select[name="status"]')).toHaveValue('rejected');

    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents?status=pending"
    await page.goto('/admin/documents?status=pending');
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('select[name="status"]')).toHaveValue('pending');
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "should filter by document type via URL"
  test('should filter by document type via URL', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents?type=ktp"
    await page.goto('/admin/documents?type=ktp');
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(page.locator('select[name="type"]')).toHaveValue('ktp');
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Document Review - Role Access"
test.describe('Admin Document Review - Role Access', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "admin should access document review"
  test('admin should access document review', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents"
    await page.goto('/admin/documents');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Antrian Review Dokumen')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor should access document review"
  test('supervisor should access document review', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/supervisor"
    await page.goto('/test/login/supervisor');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents"
    await page.goto('/admin/documents');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Antrian Review Dokumen')).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant should access document review"
  test('consultant should access document review', async ({ page }) => {
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin/documents"
    await page.goto('/admin/documents');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator('text=Antrian Review Dokumen')).toBeVisible();
  });
});
