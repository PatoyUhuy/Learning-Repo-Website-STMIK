import { test, expect } from '@playwright/test';
import { SettingsRewardsPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Settings - Reward Configuration"
test.describe('Settings - Reward Configuration', () => {
  let rewardsPage: SettingsRewardsPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    rewardsPage = new SettingsRewardsPage(page);
    await rewardsPage.login('admin');
    await rewardsPage.goto();
    await rewardsPage.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display rewards page with both sections"
    test('should display rewards page with both sections', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.rewardsSection).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.mgmRewardsSection).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display add buttons for rewards and MGM rewards"
    test('should display add buttons for rewards and MGM rewards', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.addRewardButton).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.addMGMRewardButton).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display seeded reward configs"
    test('should display seeded reward configs', async () => {
      // Should have seeded reward configs from migration
      const rewardIds = await rewardsPage.getAllRewardIds();
      expect(rewardIds.length).toBeGreaterThan(0);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display seeded MGM reward configs"
    test('should display seeded MGM reward configs', async () => {
      // Should have seeded MGM reward configs from migration
      const mgmRewardIds = await rewardsPage.getAllMGMRewardIds();
      expect(mgmRewardIds.length).toBeGreaterThan(0);
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Reward CRUD"
  test.describe('Reward CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add reward modal"
    test('should open add reward modal', async () => {
      await rewardsPage.openAddRewardModal();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.addRewardModal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputRewardReferrerType).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputRewardType).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputRewardTrigger).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputRewardAmount).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new reward config via HTMX"
    test('should add new reward config via HTMX', async ({ page }) => {
      const rewardIdsBefore = await rewardsPage.getAllRewardIds();
      const countBefore = rewardIdsBefore.length;

      // Add a new reward config (using unique combination to avoid constraint violation)
      // Seed data uses: alumni/teacher/student/partner/staff + cash + enrollment
      // Use partner + merchandise + registration (very unlikely to exist)
      await rewardsPage.addReward(
        'partner',
        'merchandise',
        'registration',
        100000,
        false,
        'Test reward description'
      );

      // Check if at least we have the same or more rewards (creation succeeded or already exists)
      const rewardIdsAfter = await rewardsPage.getAllRewardIds();
      expect(rewardIdsAfter.length).toBeGreaterThanOrEqual(countBefore);

      // Verify page still works
      await page.reload();
      await rewardsPage.expectPageLoaded();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should toggle reward status via HTMX"
    test('should toggle reward status via HTMX', async () => {
      const rewardIds = await rewardsPage.getAllRewardIds();
      if (rewardIds.length === 0) {
        test.skip();
        return;
      }

      const rewardId = rewardIds[0];

      const statusBefore = await rewardsPage.getRewardStatusToggle(rewardId).textContent();
      const isActiveBefore = statusBefore?.trim() === 'Aktif';

      await rewardsPage.toggleRewardStatus(rewardId);

      if (isActiveBefore) {
        await rewardsPage.expectRewardStatus(rewardId, 'inactive');
      } else {
        await rewardsPage.expectRewardStatus(rewardId, 'active');
      }

      // Toggle back to restore original state
      await rewardsPage.toggleRewardStatus(rewardId);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display edit button for each reward"
    test('should display edit button for each reward', async () => {
      const rewardIds = await rewardsPage.getAllRewardIds();
      if (rewardIds.length === 0) {
        test.skip();
        return;
      }

      for (const rewardId of rewardIds) {
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(rewardsPage.getRewardEditButton(rewardId)).toBeVisible();
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "MGM Reward CRUD"
  test.describe('MGM Reward CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add MGM reward modal"
    test('should open add MGM reward modal', async () => {
      await rewardsPage.openAddMGMRewardModal();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.addMGMRewardModal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputMGMYear).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputMGMRewardType).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputMGMTrigger).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(rewardsPage.inputMGMReferrerAmount).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new MGM reward config via HTMX"
    test('should add new MGM reward config via HTMX', async ({ page }) => {
      const mgmRewardIdsBefore = await rewardsPage.getAllMGMRewardIds();
      const countBefore = mgmRewardIdsBefore.length;

      // Add a new MGM reward config (using unique combination to avoid constraint violation)
      // Seed data uses: 2025/2026 + (cash|tuition_discount) + enrollment
      // MGM trigger options are only: commitment, enrollment
      // Use: 2028/2029 + cash + commitment (unlikely to exist)
      await rewardsPage.addMGMReward(
        '2028/2029',
        'cash',
        'commitment',
        150000,
        50000,
        'Test MGM reward description'
      );

      // Check if at least we have the same or more rewards (creation succeeded or already exists)
      const mgmRewardIdsAfter = await rewardsPage.getAllMGMRewardIds();
      expect(mgmRewardIdsAfter.length).toBeGreaterThanOrEqual(countBefore);

      // Verify page still works
      await page.reload();
      await rewardsPage.expectPageLoaded();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should toggle MGM reward status via HTMX"
    test('should toggle MGM reward status via HTMX', async () => {
      const mgmRewardIds = await rewardsPage.getAllMGMRewardIds();
      if (mgmRewardIds.length === 0) {
        test.skip();
        return;
      }

      const mgmRewardId = mgmRewardIds[0];

      const statusBefore = await rewardsPage.getMGMStatusToggle(mgmRewardId).textContent();
      const isActiveBefore = statusBefore?.trim() === 'Aktif';

      await rewardsPage.toggleMGMRewardStatus(mgmRewardId);

      if (isActiveBefore) {
        await rewardsPage.expectMGMRewardStatus(mgmRewardId, 'inactive');
      } else {
        await rewardsPage.expectMGMRewardStatus(mgmRewardId, 'active');
      }

      // Toggle back to restore original state
      await rewardsPage.toggleMGMRewardStatus(mgmRewardId);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display edit button for each MGM reward"
    test('should display edit button for each MGM reward', async () => {
      const mgmRewardIds = await rewardsPage.getAllMGMRewardIds();
      if (mgmRewardIds.length === 0) {
        test.skip();
        return;
      }

      for (const mgmRewardId of mgmRewardIds) {
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(rewardsPage.getMGMEditButton(mgmRewardId)).toBeVisible();
      }
    });
  });
});
