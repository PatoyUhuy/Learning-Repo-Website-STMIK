import { test, expect } from '@playwright/test';
import { SettingsCampaignsPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Settings - Campaign Management"
test.describe('Settings - Campaign Management', () => {
  let campaignsPage: SettingsCampaignsPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    campaignsPage = new SettingsCampaignsPage(page);
    await campaignsPage.login('admin');
    await campaignsPage.goto();
    await campaignsPage.expectPageLoaded();
  });

  // Baris 18 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Baris 20 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display campaigns page"
    test('should display campaigns page', async () => {
      // Baris 22 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.pageContainer).toBeVisible();
      // Baris 24 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.campaignsSection).toBeVisible();
    });

    // Baris 28 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display add campaign button"
    test('should display add campaign button', async () => {
      // Baris 30 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.addCampaignButton).toBeVisible();
    });
  });

  // Baris 35 digunakan untuk: Mengelompokkan skenario pengujian tentang "Campaign CRUD"
  test.describe('Campaign CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    // Baris 39 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add campaign modal"
    test('should open add campaign modal', async () => {
      await campaignsPage.openAddCampaignModal();
      // Baris 42 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.addCampaignModal).toBeVisible();
      // Baris 44 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.inputCampaignName).toBeVisible();
      // Baris 46 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.inputCampaignType).toBeVisible();
      // Baris 48 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.inputCampaignChannel).toBeVisible();
    });

    // Baris 52 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new campaign via HTMX"
    test('should add new campaign via HTMX', async ({ page }) => {
      const campaignIdsBefore = await campaignsPage.getAllCampaignIds();
      const countBefore = campaignIdsBefore.length;

      const uniqueName = `Test Campaign ${Date.now()}`;
      await campaignsPage.addCampaign(
        uniqueName,
        'promo',
        'instagram',
        '2026-01-01',
        '2026-03-31',
        0,
        'Test campaign description'
      );

      const campaignIdsAfter = await campaignsPage.getAllCampaignIds();
      expect(campaignIdsAfter.length).toBe(countBefore + 1);

      const newCampaignId = campaignIdsAfter.find(id => !campaignIdsBefore.includes(id));
      expect(newCampaignId).toBeTruthy();

      if (newCampaignId) {
        await campaignsPage.expectCampaignDisplayed(newCampaignId);
        await campaignsPage.expectCampaignNameContains(newCampaignId, uniqueName);

        await page.reload();
        await campaignsPage.expectPageLoaded();
        await campaignsPage.expectCampaignDisplayed(newCampaignId);
      }
    });

    // Baris 84 digunakan untuk: Memulai eksekusi pengujian dengan judul "should toggle campaign status via HTMX"
    test('should toggle campaign status via HTMX', async () => {
      const campaignIds = await campaignsPage.getAllCampaignIds();
      if (campaignIds.length === 0) {
        test.skip();
        return;
      }

      const campaignId = campaignIds[0];

      const statusBefore = await campaignsPage.getCampaignStatusToggle(campaignId).textContent();
      const isActiveBefore = statusBefore?.trim() === 'Aktif';

      await campaignsPage.toggleCampaignStatus(campaignId);

      if (isActiveBefore) {
        await campaignsPage.expectCampaignStatus(campaignId, 'inactive');
      } else {
        await campaignsPage.expectCampaignStatus(campaignId, 'active');
      }

      await campaignsPage.toggleCampaignStatus(campaignId);
    });

    // Baris 108 digunakan untuk: Memulai eksekusi pengujian dengan judul "should edit campaign name via HTMX"
    test('should edit campaign name via HTMX', async ({ page }) => {
      const campaignIds = await campaignsPage.getAllCampaignIds();
      if (campaignIds.length === 0) {
        test.skip();
        return;
      }

      const campaignId = campaignIds[0];
      const newName = `Updated Campaign ${Date.now()}`;

      await campaignsPage.editCampaignName(campaignId, newName);

      await campaignsPage.expectCampaignNameContains(campaignId, newName);

      await page.reload();
      await campaignsPage.expectPageLoaded();
      await campaignsPage.expectCampaignNameContains(campaignId, newName);
    });

    // Baris 128 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display edit button for each campaign"
    test('should display edit button for each campaign', async () => {
      const campaignIds = await campaignsPage.getAllCampaignIds();
      if (campaignIds.length === 0) {
        test.skip();
        return;
      }

      for (const campaignId of campaignIds) {
        // Baris 137 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(campaignsPage.getCampaignEditButton(campaignId)).toBeVisible();
      }
    });
  });
});
