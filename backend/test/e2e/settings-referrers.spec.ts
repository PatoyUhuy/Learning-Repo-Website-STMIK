import { test, expect } from '@playwright/test';
import { SettingsReferrersPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Settings - Referrer Management"
test.describe('Settings - Referrer Management', () => {
  let referrersPage: SettingsReferrersPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    referrersPage = new SettingsReferrersPage(page);
    await referrersPage.login('admin');
    await referrersPage.goto();
    await referrersPage.expectPageLoaded();
  });

  // Baris 18 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Baris 20 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display referrers page"
    test('should display referrers page', async () => {
      // Baris 22 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.pageContainer).toBeVisible();
      // Baris 24 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.referrersSection).toBeVisible();
    });

    // Baris 28 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display referrer stats"
    test('should display referrer stats', async () => {
      // Baris 30 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.referrerStats).toBeVisible();
      // Baris 32 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statTotal).toBeVisible();
      // Baris 34 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statAlumni).toBeVisible();
      // Baris 36 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statTeacher).toBeVisible();
      // Baris 38 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statStudent).toBeVisible();
      // Baris 40 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statPartner).toBeVisible();
      // Baris 42 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statStaff).toBeVisible();
    });

    // Baris 46 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display add referrer button"
    test('should display add referrer button', async () => {
      // Baris 48 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.addReferrerButton).toBeVisible();
    });
  });

  // Baris 53 digunakan untuk: Mengelompokkan skenario pengujian tentang "Referrer CRUD"
  test.describe('Referrer CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    // Baris 57 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add referrer modal"
    test('should open add referrer modal', async () => {
      await referrersPage.openAddReferrerModal();
      // Baris 60 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.addReferrerModal).toBeVisible();
      // Baris 62 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.inputReferrerName).toBeVisible();
      // Baris 64 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.inputReferrerType).toBeVisible();
      // Baris 66 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.inputReferrerInstitution).toBeVisible();
    });

    // Baris 70 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new alumni referrer via HTMX"
    test('should add new alumni referrer via HTMX', async ({ page }) => {
      const referrerIdsBefore = await referrersPage.getAllReferrerIds();
      const countBefore = referrerIdsBefore.length;

      const uniqueName = `Test Alumni ${Date.now()}`;
      await referrersPage.addReferrer(
        uniqueName,
        'alumni',
        'STMIK Tazkia 2023',
        '081234567890',
        'alumni@test.com',
        undefined, // auto-generate code
        500000,
        'per_enrollment'
      );

      const referrerIdsAfter = await referrersPage.getAllReferrerIds();
      expect(referrerIdsAfter.length).toBe(countBefore + 1);

      const newReferrerId = referrerIdsAfter.find(id => !referrerIdsBefore.includes(id));
      expect(newReferrerId).toBeTruthy();

      if (newReferrerId) {
        await referrersPage.expectReferrerDisplayed(newReferrerId);
        await referrersPage.expectReferrerNameContains(newReferrerId, uniqueName);

        await page.reload();
        await referrersPage.expectPageLoaded();
        await referrersPage.expectReferrerDisplayed(newReferrerId);
      }
    });

    // Baris 103 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new teacher referrer via HTMX"
    test('should add new teacher referrer via HTMX', async ({ page }) => {
      const referrerIdsBefore = await referrersPage.getAllReferrerIds();
      const countBefore = referrerIdsBefore.length;

      const uniqueName = `Test Teacher ${Date.now()}`;
      await referrersPage.addReferrer(
        uniqueName,
        'teacher',
        'SMAN 1 Bogor',
        '081234567891',
        'teacher@test.com',
        undefined,
        750000,
        'monthly',
        'BCA',
        '1234567890',
        uniqueName
      );

      const referrerIdsAfter = await referrersPage.getAllReferrerIds();
      expect(referrerIdsAfter.length).toBe(countBefore + 1);

      const newReferrerId = referrerIdsAfter.find(id => !referrerIdsBefore.includes(id));
      expect(newReferrerId).toBeTruthy();

      if (newReferrerId) {
        await referrersPage.expectReferrerDisplayed(newReferrerId);
        await referrersPage.expectReferrerNameContains(newReferrerId, uniqueName);
      }
    });

    // Baris 135 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new partner referrer via HTMX"
    test('should add new partner referrer via HTMX', async ({ page }) => {
      const referrerIdsBefore = await referrersPage.getAllReferrerIds();
      const countBefore = referrerIdsBefore.length;

      const uniqueName = `Test Partner ${Date.now()}`;
      await referrersPage.addReferrer(
        uniqueName,
        'partner',
        'Bimbel Test',
        '021-7654321',
        'partner@test.com',
        `REF-P${Date.now().toString().slice(-4)}`,
        1000000
      );

      const referrerIdsAfter = await referrersPage.getAllReferrerIds();
      expect(referrerIdsAfter.length).toBe(countBefore + 1);

      const newReferrerId = referrerIdsAfter.find(id => !referrerIdsBefore.includes(id));
      expect(newReferrerId).toBeTruthy();

      if (newReferrerId) {
        await referrersPage.expectReferrerDisplayed(newReferrerId);
        await referrersPage.expectReferrerNameContains(newReferrerId, uniqueName);
      }
    });

    // Baris 163 digunakan untuk: Memulai eksekusi pengujian dengan judul "should toggle referrer status via HTMX"
    test('should toggle referrer status via HTMX', async () => {
      const referrerIds = await referrersPage.getAllReferrerIds();
      if (referrerIds.length === 0) {
        test.skip();
        return;
      }

      const referrerId = referrerIds[0];

      const statusBefore = await referrersPage.getReferrerStatusToggle(referrerId).textContent();
      const isActiveBefore = statusBefore?.trim() === 'Aktif';

      await referrersPage.toggleReferrerStatus(referrerId);

      if (isActiveBefore) {
        await referrersPage.expectReferrerStatus(referrerId, 'inactive');
      } else {
        await referrersPage.expectReferrerStatus(referrerId, 'active');
      }

      // Toggle back
      await referrersPage.toggleReferrerStatus(referrerId);
    });

    // Baris 188 digunakan untuk: Memulai eksekusi pengujian dengan judul "should edit referrer name via HTMX"
    test('should edit referrer name via HTMX', async ({ page }) => {
      const referrerIds = await referrersPage.getAllReferrerIds();
      if (referrerIds.length === 0) {
        test.skip();
        return;
      }

      const referrerId = referrerIds[0];
      const newName = `Updated Referrer ${Date.now()}`;

      await referrersPage.editReferrerName(referrerId, newName);

      await referrersPage.expectReferrerNameContains(referrerId, newName);

      await page.reload();
      await referrersPage.expectPageLoaded();
      await referrersPage.expectReferrerNameContains(referrerId, newName);
    });

    // Baris 208 digunakan untuk: Memulai eksekusi pengujian dengan judul "should edit referrer institution via HTMX"
    test('should edit referrer institution via HTMX', async ({ page }) => {
      const referrerIds = await referrersPage.getAllReferrerIds();
      if (referrerIds.length === 0) {
        test.skip();
        return;
      }

      const referrerId = referrerIds[0];
      const newInstitution = `Updated Institution ${Date.now()}`;

      await referrersPage.editReferrerInstitution(referrerId, newInstitution);

      await referrersPage.expectReferrerInstitutionContains(referrerId, newInstitution);

      await page.reload();
      await referrersPage.expectPageLoaded();
      await referrersPage.expectReferrerInstitutionContains(referrerId, newInstitution);
    });

    // Baris 228 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display edit button for each referrer"
    test('should display edit button for each referrer', async () => {
      const referrerIds = await referrersPage.getAllReferrerIds();
      if (referrerIds.length === 0) {
        test.skip();
        return;
      }

      for (const referrerId of referrerIds) {
        // Baris 237 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(referrersPage.getReferrerEditButton(referrerId)).toBeVisible();
      }
    });
  });

  // Baris 243 digunakan untuk: Mengelompokkan skenario pengujian tentang "Stats Verification"
  test.describe('Stats Verification', () => {
    // Baris 245 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update stats when adding referrer"
    test('should update stats when adding referrer', async ({ page }) => {
      // Get initial stats
      const initialTotal = await referrersPage.statTotal.textContent();
      const initialTotalNum = parseInt(initialTotal || '0', 10);

      // Add a new referrer
      const uniqueName = `Stats Test ${Date.now()}`;
      await referrersPage.addReferrer(
        uniqueName,
        'student',
        'SMA Test',
        '081234567899'
      );

      // Reload to get updated stats
      await page.reload();
      await referrersPage.expectPageLoaded();

      // Verify stats increased
      const newTotal = await referrersPage.statTotal.textContent();
      const newTotalNum = parseInt(newTotal || '0', 10);
      expect(newTotalNum).toBe(initialTotalNum + 1);
    });
  });
});
