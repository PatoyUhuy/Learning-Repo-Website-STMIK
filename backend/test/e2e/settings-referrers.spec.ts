import { test, expect } from '@playwright/test';
import { SettingsReferrersPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Settings - Referrer Management"
test.describe('Settings - Referrer Management', () => {
  let referrersPage: SettingsReferrersPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    referrersPage = new SettingsReferrersPage(page);
    await referrersPage.login('admin');
    await referrersPage.goto();
    await referrersPage.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display referrers page"
    test('should display referrers page', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.pageContainer).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.referrersSection).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display referrer stats"
    test('should display referrer stats', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.referrerStats).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statTotal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statAlumni).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statTeacher).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statStudent).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statPartner).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.statStaff).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display add referrer button"
    test('should display add referrer button', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.addReferrerButton).toBeVisible();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Referrer CRUD"
  test.describe('Referrer CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add referrer modal"
    test('should open add referrer modal', async () => {
      await referrersPage.openAddReferrerModal();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.addReferrerModal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.inputReferrerName).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.inputReferrerType).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(referrersPage.inputReferrerInstitution).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new alumni referrer via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new teacher referrer via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new partner referrer via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should toggle referrer status via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should edit referrer name via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should edit referrer institution via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display edit button for each referrer"
    test('should display edit button for each referrer', async () => {
      const referrerIds = await referrersPage.getAllReferrerIds();
      if (referrerIds.length === 0) {
        test.skip();
        return;
      }

      for (const referrerId of referrerIds) {
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(referrersPage.getReferrerEditButton(referrerId)).toBeVisible();
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Stats Verification"
  test.describe('Stats Verification', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should update stats when adding referrer"
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
