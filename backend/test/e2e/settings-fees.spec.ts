import { test, expect } from '@playwright/test';
import { SettingsFeesPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Settings - Fee Structure Management"
test.describe('Settings - Fee Structure Management', () => {
  let feesPage: SettingsFeesPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    feesPage = new SettingsFeesPage(page);
    // Login as admin before each test
    await feesPage.login('admin');
    await feesPage.goto();
    await feesPage.expectPageLoaded();
  });

  // Baris 19 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Baris 21 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display fees page with table"
    test('should display fees page with table', async () => {
      // Baris 23 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.feesSection).toBeVisible();
      // Baris 25 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.feesTable).toBeVisible();
    });

    // Baris 29 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display academic year selector"
    test('should display academic year selector', async () => {
      // Baris 31 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.academicYearSelect).toBeVisible();
    });

    // Baris 35 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display add fee button"
    test('should display add fee button', async () => {
      // Baris 37 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.addFeeButton).toBeVisible();
    });
  });

  // Baris 42 digunakan untuk: Mengelompokkan skenario pengujian tentang "Fee Display"
  test.describe('Fee Display', () => {
    // Baris 44 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display fee type columns in table header"
    test('should display fee type columns in table header', async () => {
      // Verify table headers exist
      const table = feesPage.feesTable;
      // Baris 48 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(table.locator('th').first()).toBeVisible();
    });
  });

  // Baris 53 digunakan untuk: Mengelompokkan skenario pengujian tentang "Fee CRUD"
  test.describe('Fee CRUD', () => {
    // Run CRUD tests serially to avoid race conditions
    test.describe.configure({ mode: 'serial' });

    // Baris 58 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add fee modal"
    test('should open add fee modal', async () => {
      await feesPage.openAddFeeModal();
      // Baris 61 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.addFeeModal).toBeVisible();
      // Baris 63 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.inputFeeType).toBeVisible();
      // Baris 65 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.inputFeeProdi).toBeVisible();
      // Baris 67 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(feesPage.inputFeeAmount).toBeVisible();
    });

    // Baris 71 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new fee structure via HTMX"
    test('should add new fee structure via HTMX', async ({ page }) => {
      // Get current fee count
      const feeIdsBefore = await feesPage.getAllFeeIds();
      const countBefore = feeIdsBefore.length;

      // Add new fee (first fee type, all prodi, 5000000)
      await feesPage.addFee(1, null, 5000000);

      // Verify new fee appears
      const feeIdsAfter = await feesPage.getAllFeeIds();
      expect(feeIdsAfter.length).toBe(countBefore + 1);

      // Find the new fee
      const newFeeId = feeIdsAfter.find(id => !feeIdsBefore.includes(id));
      expect(newFeeId).toBeTruthy();

      if (newFeeId) {
        await feesPage.expectFeeDisplayed(newFeeId);

        // Reload and verify persistence
        await page.reload();
        await feesPage.expectPageLoaded();
        await feesPage.expectFeeDisplayed(newFeeId);
      }
    });

    // Baris 98 digunakan untuk: Memulai eksekusi pengujian dengan judul "should toggle fee status via HTMX"
    test('should toggle fee status via HTMX', async () => {
      const feeIds = await feesPage.getAllFeeIds();
      if (feeIds.length === 0) {
        test.skip();
        return;
      }

      const feeId = feeIds[0];

      // Get current status
      const statusBefore = await feesPage.getFeeStatusToggle(feeId).textContent();
      const isActiveBefore = statusBefore?.trim() === 'Aktif';

      // Toggle status
      await feesPage.toggleFeeStatus(feeId);

      // Verify status changed
      if (isActiveBefore) {
        await feesPage.expectFeeStatus(feeId, 'inactive');
      } else {
        await feesPage.expectFeeStatus(feeId, 'active');
      }

      // Toggle back to restore original state
      await feesPage.toggleFeeStatus(feeId);
    });

    // Baris 126 digunakan untuk: Memulai eksekusi pengujian dengan judul "should edit fee amount"
    test('should edit fee amount', async ({ page }) => {
      const feeIds = await feesPage.getAllFeeIds();
      if (feeIds.length === 0) {
        test.skip();
        return;
      }

      const feeId = feeIds[0];

      // Edit with new amount
      const newAmount = 7500000;
      await feesPage.updateFeeAmount(feeId, newAmount);

      // Verify amount changed (check for formatted amount)
      await feesPage.expectFeeAmountContains(feeId, '7.500.000');

      // Reload and verify persistence
      await page.reload();
      await feesPage.expectPageLoaded();
      await feesPage.expectFeeAmountContains(feeId, '7.500.000');
    });

    // Baris 149 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display edit button for each fee"
    test('should display edit button for each fee', async () => {
      const feeIds = await feesPage.getAllFeeIds();
      if (feeIds.length === 0) {
        test.skip();
        return;
      }

      for (const feeId of feeIds) {
        // Baris 158 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(feesPage.getFeeEditButton(feeId)).toBeVisible();
      }
    });
  });
});
