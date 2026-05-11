import { test, expect } from '@playwright/test';
import { RegistrationPage, LoginPage } from './pages';

// Generate unique identifiers for test data
function generateUniqueEmail(): string {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
}

function generateUniquePhone(): string {
  const timestamp = Date.now();
  // Generate a unique phone number (Indonesia format)
  return `08${timestamp.toString().slice(-10)}`;
}

// Baris 17 digunakan untuk: Mengelompokkan skenario pengujian tentang "Candidate Registration"
test.describe('Candidate Registration', () => {
  let registrationPage: RegistrationPage;

  // Baris 21 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 23 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.expectPageLoaded();
  });

  // Baris 29 digunakan untuk: Mengelompokkan skenario pengujian tentang "Step 1: Account Creation"
  test.describe('Step 1: Account Creation', () => {
    // Baris 31 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display step 1 form initially"
    test('should display step 1 form initially', async () => {
      await registrationPage.expectStep1Visible();
    });

    // Baris 36 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error if neither email nor phone provided"
    test('should show error if neither email nor phone provided', async () => {
      await registrationPage.inputPassword.fill('testpassword123');
      await registrationPage.inputPasswordConfirm.fill('testpassword123');
      await registrationPage.btnSubmitStep1.click();

      await registrationPage.expectErrorMessage('email atau nomor HP');
    });

    // Baris 45 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error if passwords do not match"
    test('should show error if passwords do not match', async () => {
      await registrationPage.inputEmail.fill(generateUniqueEmail());
      await registrationPage.inputPassword.fill('testpassword123');
      await registrationPage.inputPasswordConfirm.fill('differentpassword');
      await registrationPage.btnSubmitStep1.click();

      await registrationPage.expectErrorMessage('tidak cocok');
    });

    // Baris 55 digunakan untuk: Memulai eksekusi pengujian dengan judul "should prevent submission if password too short (browser validation)"
    test('should prevent submission if password too short (browser validation)', async ({ page }) => {
      await registrationPage.inputEmail.fill(generateUniqueEmail());
      await registrationPage.inputPassword.fill('short');
      await registrationPage.inputPasswordConfirm.fill('short');
      await registrationPage.btnSubmitStep1.click();

      // Browser's HTML5 validation should prevent form submission
      // We should still be on step 1
      await registrationPage.expectStep1Visible();

      // Check that the password field has validation error (via :invalid pseudo-class)
      const isInvalid = await registrationPage.inputPassword.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBe(true);
    });

    // Baris 71 digunakan untuk: Memulai eksekusi pengujian dengan judul "should proceed to step 2 with email only"
    test('should proceed to step 2 with email only', async () => {
      const email = generateUniqueEmail();
      await registrationPage.fillStep1WithEmail(email, 'testpassword123');

      await registrationPage.expectStep2Visible();
    });

    // Baris 79 digunakan untuk: Memulai eksekusi pengujian dengan judul "should proceed to step 2 with phone only"
    test('should proceed to step 2 with phone only', async () => {
      const phone = generateUniquePhone();
      await registrationPage.fillStep1WithPhone(phone, 'testpassword123');

      await registrationPage.expectStep2Visible();
    });

    // Baris 87 digunakan untuk: Memulai eksekusi pengujian dengan judul "should proceed to step 2 with both email and phone"
    test('should proceed to step 2 with both email and phone', async () => {
      const email = generateUniqueEmail();
      const phone = generateUniquePhone();
      await registrationPage.fillStep1WithBoth(email, phone, 'testpassword123');

      await registrationPage.expectStep2Visible();
    });
  });

  // Baris 97 digunakan untuk: Mengelompokkan skenario pengujian tentang "Step 2: Personal Info"
  test.describe('Step 2: Personal Info', () => {
    // Baris 99 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
    test.beforeEach(async () => {
      // Complete step 1 first
      const email = generateUniqueEmail();
      await registrationPage.fillStep1WithEmail(email, 'testpassword123');
      await registrationPage.expectStep2Visible();
    });

    // Baris 107 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error if required fields are empty"
    test('should show error if required fields are empty', async ({ page }) => {
      await registrationPage.btnSubmitStep2.click();
      // Browser validation should prevent submission
      await registrationPage.expectStep2Visible();
    });

    // Baris 114 digunakan untuk: Memulai eksekusi pengujian dengan judul "should proceed to step 3 with valid data"
    test('should proceed to step 3 with valid data', async () => {
      await registrationPage.fillStep2(
        'Test Candidate',
        'Jl. Test No. 123',
        'Jakarta',
        'DKI Jakarta'
      );

      await registrationPage.expectStep3Visible();
    });
  });

  // Baris 127 digunakan untuk: Mengelompokkan skenario pengujian tentang "Step 3: Education"
  test.describe('Step 3: Education', () => {
    // Baris 129 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
    test.beforeEach(async () => {
      // Complete steps 1 and 2 first
      const email = generateUniqueEmail();
      await registrationPage.fillStep1WithEmail(email, 'testpassword123');
      await registrationPage.expectStep2Visible();
      await registrationPage.fillStep2(
        'Test Candidate',
        'Jl. Test No. 123',
        'Jakarta',
        'DKI Jakarta'
      );
      await registrationPage.expectStep3Visible();
    });

    // Baris 144 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display education form"
    test('should display education form', async () => {
      // Baris 146 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(registrationPage.inputHighSchool).toBeVisible();
      // Baris 148 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(registrationPage.selectGraduationYear).toBeVisible();
    });

    // Baris 152 digunakan untuk: Memulai eksekusi pengujian dengan judul "should proceed to step 4 with valid data"
    test('should proceed to step 4 with valid data', async ({ page }) => {
      // Check if there are programs available
      const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
      const radioCount = await prodiRadios.count();

      if (radioCount === 0) {
        test.skip();
        return;
      }

      await registrationPage.inputHighSchool.fill('SMA Negeri 1 Jakarta');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();

      await registrationPage.expectStep4Visible();
    });
  });

  // Baris 172 digunakan untuk: Mengelompokkan skenario pengujian tentang "Step 4: Source Tracking and Completion"
  test.describe('Step 4: Source Tracking and Completion', () => {
    // Baris 174 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
    test.beforeEach(async ({ page }) => {
      // Complete steps 1, 2, and 3 first
      const email = generateUniqueEmail();
      await registrationPage.fillStep1WithEmail(email, 'testpassword123');
      await registrationPage.expectStep2Visible();
      await registrationPage.fillStep2(
        'Test Candidate',
        'Jl. Test No. 123',
        'Jakarta',
        'DKI Jakarta'
      );
      await registrationPage.expectStep3Visible();

      // Check if there are programs available
      const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
      const radioCount = await prodiRadios.count();

      if (radioCount === 0) {
        test.skip();
        return;
      }

      await registrationPage.inputHighSchool.fill('SMA Negeri 1 Jakarta');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
    });

    // Baris 204 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display source tracking form"
    test('should display source tracking form', async () => {
      // Baris 206 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(registrationPage.selectSourceType).toBeVisible();
    });

    // Baris 210 digunakan untuk: Memulai eksekusi pengujian dengan judul "should complete registration and redirect to portal"
    test('should complete registration and redirect to portal', async () => {
      await registrationPage.fillStep4('instagram');
      await registrationPage.expectRedirectToPortal();
    });

    // Baris 216 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show detail field for referral source types"
    test('should show detail field for referral source types', async ({ page }) => {
      await registrationPage.selectSourceType.selectOption('friend_family');
      const detailContainer = page.locator('#source_detail_container');
      // Baris 220 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(detailContainer).toBeVisible();
    });
  });
});

// Baris 226 digunakan untuk: Mengelompokkan skenario pengujian tentang "Candidate Login"
test.describe('Candidate Login', () => {
  let loginPage: LoginPage;
  let registrationPage: RegistrationPage;
  let testEmail: string;
  let testPhone: string;
  const testPassword = 'testpassword123';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate with email first
    // Baris 236 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 238 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    registrationPage = new RegistrationPage(page);
    testEmail = generateUniqueEmail();

    await registrationPage.goto();
    await registrationPage.expectPageLoaded();
    await registrationPage.fillStep1WithEmail(testEmail, testPassword);
    await registrationPage.expectStep2Visible();
    await registrationPage.fillStep2(
      'Login Test User',
      'Jl. Test No. 456',
      'Bandung',
      'Jawa Barat'
    );
    await registrationPage.expectStep3Visible();

    // Check if there are programs available
    const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
    const radioCount = await prodiRadios.count();

    if (radioCount > 0) {
      await registrationPage.inputHighSchool.fill('SMA Negeri 1 Bandung');
      await registrationPage.selectGraduationYear.selectOption('2025');
      await prodiRadios.first().click();
      await registrationPage.btnSubmitStep3.click();
      await registrationPage.expectStep4Visible();
      await registrationPage.fillStep4('google');
    }

    // Baris 267 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();

    // Create another test candidate with phone
    const page2 = await browser.newPage();
    // Baris 272 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage2 = new RegistrationPage(page2);
    testPhone = generateUniquePhone();

    await registrationPage2.goto();
    await registrationPage2.expectPageLoaded();
    await registrationPage2.fillStep1WithPhone(testPhone, testPassword);
    await registrationPage2.expectStep2Visible();
    await registrationPage2.fillStep2(
      'Phone Login Test User',
      'Jl. Phone Test No. 789',
      'Surabaya',
      'Jawa Timur'
    );
    await registrationPage2.expectStep3Visible();

    const prodiRadios2 = page2.locator('[data-testid^="radio-prodi-"]');
    const radioCount2 = await prodiRadios2.count();

    if (radioCount2 > 0) {
      await registrationPage2.inputHighSchool.fill('SMA Negeri 1 Surabaya');
      await registrationPage2.selectGraduationYear.selectOption('2025');
      await prodiRadios2.first().click();
      await registrationPage2.btnSubmitStep3.click();
      await registrationPage2.expectStep4Visible();
      await registrationPage2.fillStep4('instagram');
    }

    await page2.close();
  });

  // Baris 303 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 305 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectPageLoaded();
  });

  // Baris 311 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display login form"
  test('should display login form', async () => {
    // Baris 313 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(loginPage.inputIdentifier).toBeVisible();
    // Baris 315 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(loginPage.inputPassword).toBeVisible();
    // Baris 317 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(loginPage.btnLogin).toBeVisible();
  });

  // Baris 321 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error for invalid credentials"
  test('should show error for invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await loginPage.expectErrorMessage('salah');
  });

  // Baris 327 digunakan untuk: Memulai eksekusi pengujian dengan judul "should login with correct email and password"
  test('should login with correct email and password', async () => {
    await loginPage.login(testEmail, testPassword);
    await loginPage.expectRedirectToPortal();
  });

  // Baris 333 digunakan untuk: Memulai eksekusi pengujian dengan judul "should login with correct phone and password"
  test('should login with correct phone and password', async () => {
    await loginPage.login(testPhone, testPassword);
    await loginPage.expectRedirectToPortal();
  });

  // Baris 339 digunakan untuk: Memulai eksekusi pengujian dengan judul "should redirect to login when accessing portal without session"
  test('should redirect to login when accessing portal without session', async ({ page }) => {
    // Clear cookies first
    await page.context().clearCookies();
    // Baris 343 digunakan untuk: Membuka browser dan menavigasi ke halaman "/portal"
    await page.goto('/portal');
    // Should still be on portal for mockup (no auth protection yet)
    // This test can be updated when portal is protected
  });
});

// Baris 350 digunakan untuk: Mengelompokkan skenario pengujian tentang "Duplicate Account Prevention"
test.describe('Duplicate Account Prevention', () => {
  let registrationPage: RegistrationPage;
  let existingEmail: string;
  let existingPhone: string;
  const testPassword = 'testpassword123';

  test.beforeAll(async ({ browser }) => {
    // Create a test candidate with both email and phone
    // Baris 359 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 361 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    registrationPage = new RegistrationPage(page);
    existingEmail = generateUniqueEmail();
    existingPhone = generateUniquePhone();

    await registrationPage.goto();
    await registrationPage.expectPageLoaded();
    await registrationPage.fillStep1WithBoth(existingEmail, existingPhone, testPassword);
    await registrationPage.expectStep2Visible();

    // Baris 371 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 375 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error when registering with existing email"
  test('should show error when registering with existing email', async ({ page }) => {
    // Baris 377 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const regPage = new RegistrationPage(page);
    await regPage.goto();
    await regPage.expectPageLoaded();

    // Try to register with the same email
    await regPage.inputEmail.fill(existingEmail);
    await regPage.inputPassword.fill(testPassword);
    await regPage.inputPasswordConfirm.fill(testPassword);
    await regPage.btnSubmitStep1.click();

    await regPage.expectErrorMessage('sudah terdaftar');
  });

  // Baris 391 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show error when registering with existing phone"
  test('should show error when registering with existing phone', async ({ page }) => {
    // Baris 393 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const regPage = new RegistrationPage(page);
    await regPage.goto();
    await regPage.expectPageLoaded();

    // Try to register with the same phone
    await regPage.inputPhone.fill(existingPhone);
    await regPage.inputPassword.fill(testPassword);
    await regPage.inputPasswordConfirm.fill(testPassword);
    await regPage.btnSubmitStep1.click();

    await regPage.expectErrorMessage('sudah terdaftar');
  });
});

// Baris 408 digunakan untuk: Mengelompokkan skenario pengujian tentang "Registration with Tracking Parameters"
test.describe('Registration with Tracking Parameters', () => {
  // Baris 410 digunakan untuk: Memulai eksekusi pengujian dengan judul "should preserve ref parameter through registration"
  test('should preserve ref parameter through registration', async ({ page }) => {
    // Baris 412 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    await registrationPage.gotoWithRef('TEST123');
    await registrationPage.expectPageLoaded();

    // Check that ref is in a hidden field
    const refInput = page.locator('input[name="ref"]');
    // Baris 419 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(refInput).toHaveValue('TEST123');
  });

  // Baris 423 digunakan untuk: Memulai eksekusi pengujian dengan judul "should preserve campaign parameter through registration"
  test('should preserve campaign parameter through registration', async ({ page }) => {
    // Baris 425 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const registrationPage = new RegistrationPage(page);
    await registrationPage.gotoWithCampaign('SUMMER2026');
    await registrationPage.expectPageLoaded();

    // Check that campaign is in a hidden field
    const campaignInput = page.locator('input[name="utm_campaign"]');
    // Baris 432 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(campaignInput).toHaveValue('SUMMER2026');
  });
});
