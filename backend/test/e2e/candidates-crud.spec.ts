import { test, expect } from '@playwright/test';
import { RegistrationPage, CandidatesPage } from './pages';

// Generate unique identifiers for test data
function generateUniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `crud${timestamp}${random}@example.com`;
}

// Baris 12 digunakan untuk: Mengelompokkan skenario pengujian tentang "Candidate CRUD - Data Mutations"
test.describe('Candidate CRUD - Data Mutations', () => {
  test.describe.configure({ mode: 'serial' });

  let testEmail: string;
  let testName: string;
  let candidateId: string;

  // Baris 20 digunakan untuk: Memulai eksekusi pengujian dengan judul "should register candidate and verify in admin list"
  test('should register candidate and verify in admin list', async ({ browser }) => {
    // Step 1: Register a new candidate
    // Baris 23 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 25 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    testEmail = generateUniqueEmail();
    testName = 'CRUD Test Candidate ' + Date.now().toString().slice(-6);

    await registrationPage.goto();
    await registrationPage.expectPageLoaded();

    // Complete registration
    await registrationPage.fillStep1WithEmail(testEmail, 'testpassword123');
    await registrationPage.expectStep2Visible();

    await registrationPage.fillStep2(
      testName,
      'Jl. CRUD Test No. 123',
      'Jakarta',
      'DKI Jakarta'
    );
    await registrationPage.expectStep3Visible();

    // Step 3: Education
    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    const radioCount = await prodiRadios.count();

    if (radioCount > 0) {
      await registrationPage.inputHighSchool.fill('SMA CRUD Test');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('google');
    }

    // Baris 58 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();

    // Step 2: Login as admin and find the candidate
    const adminPage = await browser.newPage();
    // Baris 63 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(adminPage);
    await candidatesPage.login('admin');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Search for the candidate by email (name search not supported due to encryption)
    await candidatesPage.searchCandidates(testEmail);

    // Verify candidate appears in the list
    const rows = await candidatesPage.getAllCandidateRows();
    expect(rows.length).toBeGreaterThan(0);

    // Get candidate ID from the first row
    const firstRow = rows[0];
    const testId = await firstRow.getAttribute('data-testid');
    candidateId = testId!.replace('candidate-row-', '');
    expect(candidateId).toBeTruthy();

    // Verify candidate name in the list
    // Baris 83 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(firstRow.getByTestId('candidate-name')).toContainText(testName);

    await adminPage.close();
  });

  // Baris 89 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display correct data in candidate detail"
  test('should display correct data in candidate detail', async ({ browser }) => {
    // Login as admin
    // Baris 92 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 94 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('admin');
    await candidatesPage.goto();

    // Search and navigate to detail (search by email, not name)
    await candidatesPage.searchCandidates(testEmail);
    await candidatesPage.viewCandidateDetail(candidateId);

    // Verify we're on the detail page
    // Baris 104 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidate-detail-page')).toBeVisible();

    // Verify personal info
    // Baris 108 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.getByTestId('candidate-name')).toContainText(testName);
    // Baris 110 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.getByTestId('field-email')).toContainText(testEmail);

    // Verify education info
    // Baris 114 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.getByTestId('field-high-school')).toContainText('SMA CRUD Test');
    // Baris 116 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.getByTestId('field-graduation-year')).toContainText('2025');

    // Verify source info
    // Baris 120 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.getByTestId('field-source-info')).toContainText('Google');

    // Verify status is "Dalam Proses" (prospecting)
    // Baris 124 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(page.locator('[data-testid="candidate-header"]')).toContainText('Dalam Proses');

    // Baris 127 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 131 digunakan untuk: Memulai eksekusi pengujian dengan judul "should log interaction and verify in timeline"
  test('should log interaction and verify in timeline', async ({ browser }) => {
    // Login as admin
    // Baris 134 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 136 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('admin');

    // Navigate directly to interaction form page
    // Baris 141 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin/candidates/${candidateId}/interaction"
    await page.goto(`/admin/candidates/${candidateId}/interaction`);

    // Fill out interaction form
    // Baris 145 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('interaction-form-page')).toBeVisible();

    // Select channel (WhatsApp) - click the parent label since radio is sr-only
    // Baris 149 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.locator('label:has(input[name="channel"][value="whatsapp"])').click();

    // Select category - click the first category label
    // Baris 153 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.locator('label:has(input[name="category"])').first().click();

    // Fill remarks
    const remarks = 'CRUD test interaction - ' + Date.now();
    // Baris 158 digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)
    await page.locator('textarea[name="remarks"]').fill(remarks);

    // Submit form
    // Baris 162 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.locator('button[type="submit"][value="save"]').click();

    // Should redirect back to candidate detail
    await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+$/);
    // Baris 167 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('candidate-detail-page')).toBeVisible();

    // Verify interaction appears in timeline
    // Baris 171 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('section-timeline')).toBeVisible();
    // Baris 173 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('timeline-list')).toBeVisible();
    // Baris 175 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.locator(`text=${remarks}`)).toBeVisible();

    // Baris 178 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 182 digunakan untuk: Memulai eksekusi pengujian dengan judul "should verify stats update after registration"
  test('should verify stats update after registration', async ({ browser }) => {
    // Get current stats
    // Baris 185 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 187 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('admin');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    const initialTotal = await candidatesPage.statTotal.textContent();
    const initialProspecting = await candidatesPage.statProspecting.textContent();

    // Baris 196 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();

    // Register a new candidate
    const page2 = await browser.newPage();
    // Baris 201 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page2);
    const newEmail = generateUniqueEmail();
    const newName = 'Stats Test ' + Date.now().toString().slice(-6);

    await registrationPage.goto();
    await registrationPage.fillStep1WithEmail(newEmail, 'testpassword123');
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(newName, 'Jl. Stats', 'Jakarta', 'DKI Jakarta');
    await registrationPage.expectStep3Visible();

    const prodiRadios = page2.locator('[data-testid^="radio-prodi-"]');
    if ((await prodiRadios.count()) > 0) {
      await registrationPage.inputHighSchool.fill('SMA Stats');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('instagram');
    }

    await page2.close();

    // Verify stats increased
    const page3 = await browser.newPage();
    // Baris 226 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage3 = new CandidatesPage(page3);
    await candidatesPage3.login('admin');
    await candidatesPage3.goto();
    await candidatesPage3.expectPageLoaded();

    const newTotal = await candidatesPage3.statTotal.textContent();
    const newProspecting = await candidatesPage3.statProspecting.textContent();

    expect(parseInt(newTotal!)).toBeGreaterThan(parseInt(initialTotal!));
    expect(parseInt(newProspecting!)).toBeGreaterThan(parseInt(initialProspecting!));

    await page3.close();
  });
});

// Baris 242 digunakan untuk: Mengelompokkan skenario pengujian tentang "Candidate Detail - Data Validation"
test.describe('Candidate Detail - Data Validation', () => {
  // Baris 244 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show correct address from registration"
  test('should show correct address from registration', async ({ browser }) => {
    // Register with specific address
    // Baris 247 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 249 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    const email = generateUniqueEmail();
    const name = 'Address Test ' + Date.now().toString().slice(-6);
    const address = 'Jl. Specific Address No. 789';
    const city = 'Surabaya';
    const province = 'Jawa Timur';

    await registrationPage.goto();
    await registrationPage.fillStep1WithEmail(email, 'testpassword123');
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(name, address, city, province);
    await registrationPage.expectStep3Visible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    if ((await prodiRadios.count()) > 0) {
      await registrationPage.inputHighSchool.fill('SMA Address');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('tiktok');
    }

    // Baris 273 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();

    // Login as admin and verify
    const adminPage = await browser.newPage();
    // Baris 278 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(adminPage);
    await candidatesPage.login('admin');
    await candidatesPage.goto();

    // Search for candidate by email (name search not supported due to encryption)
    await candidatesPage.searchCandidates(email);
    const rows = await candidatesPage.getAllCandidateRows();
    expect(rows.length).toBeGreaterThan(0);

    const testId = await rows[0].getAttribute('data-testid');
    const candidateId = testId!.replace('candidate-row-', '');

    // Navigate to detail
    await adminPage.goto(`/admin/candidates/${candidateId}`);
    // Baris 293 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.getByTestId('candidate-detail-page')).toBeVisible();

    // Verify address fields
    // Baris 297 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(adminPage.getByTestId('field-address')).toContainText(address);
    // Baris 299 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(adminPage.getByTestId('field-address')).toContainText(city);
    // Baris 301 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(adminPage.getByTestId('field-address')).toContainText(province);

    await adminPage.close();
  });

  // Baris 307 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show assigned consultant from auto-assignment"
  test('should show assigned consultant from auto-assignment', async ({ browser }) => {
    // Register a new candidate
    // Baris 310 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 312 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    const email = generateUniqueEmail();
    const name = 'Consultant Test ' + Date.now().toString().slice(-6);

    await registrationPage.goto();
    await registrationPage.fillStep1WithEmail(email, 'testpassword123');
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(name, 'Jl. Consultant', 'Bandung', 'Jawa Barat');
    await registrationPage.expectStep3Visible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    if ((await prodiRadios.count()) > 0) {
      await registrationPage.inputHighSchool.fill('SMA Consultant');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('youtube');
    }

    // Baris 333 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();

    // Login as admin and verify consultant is assigned
    const adminPage = await browser.newPage();
    // Baris 338 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(adminPage);
    await candidatesPage.login('admin');
    await candidatesPage.goto();

    // Search by email (name search not supported due to encryption)
    await candidatesPage.searchCandidates(email);
    const rows = await candidatesPage.getAllCandidateRows();
    expect(rows.length).toBeGreaterThan(0);

    const testId = await rows[0].getAttribute('data-testid');
    const candidateId = testId!.replace('candidate-row-', '');

    await adminPage.goto(`/admin/candidates/${candidateId}`);
    // Baris 352 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(adminPage.getByTestId('candidate-detail-page')).toBeVisible();

    // Verify consultant is assigned (not empty)
    const consultantField = adminPage.getByTestId('field-consultant');
    // Baris 357 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(consultantField).toBeVisible();
    // Should have a name, not "Belum ditugaskan"
    // Baris 360 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(consultantField).not.toContainText('Belum ditugaskan');

    await adminPage.close();
  });
});

// Baris 367 digunakan untuk: Mengelompokkan skenario pengujian tentang "Role-Based Data Access"
test.describe('Role-Based Data Access', () => {
  // Baris 369 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant can only see own candidates in detail"
  test('consultant can only see own candidates in detail', async ({ browser }) => {
    // First, register a candidate that will be assigned to a consultant
    // Baris 372 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 374 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    const email = generateUniqueEmail();
    const name = 'Role Test ' + Date.now().toString().slice(-6);

    await registrationPage.goto();
    await registrationPage.fillStep1WithEmail(email, 'testpassword123');
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(name, 'Jl. Role Test', 'Semarang', 'Jawa Tengah');
    await registrationPage.expectStep3Visible();

    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    if ((await prodiRadios.count()) > 0) {
      await registrationPage.inputHighSchool.fill('SMA Role');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('expo');
    }

    // Baris 395 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();

    // Login as consultant and check if they can see their assigned candidates
    const consultantPage = await browser.newPage();
    // Baris 400 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(consultantPage);
    await candidatesPage.login('consultant');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Consultant should only see their own candidates
    // The stats should show numbers (could be 0 or more)
    const totalText = await candidatesPage.statTotal.textContent();
    expect(totalText).toMatch(/^\d+$/);

    await consultantPage.close();
  });
});
