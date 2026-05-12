import { test, expect } from '@playwright/test';
import { SettingsCampaignsPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Settings - Campaign Management"
test.describe('Settings - Campaign Management', () => {
  let campaignsPage: SettingsCampaignsPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    campaignsPage = new SettingsCampaignsPage(page);
    await campaignsPage.login('admin');
    await campaignsPage.goto();
    await campaignsPage.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display campaigns page"
    test('should display campaigns page', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.pageContainer).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.campaignsSection).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display add campaign button"
    test('should display add campaign button', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.addCampaignButton).toBeVisible();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Campaign CRUD"
  test.describe('Campaign CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add campaign modal"
    test('should open add campaign modal', async () => {
      await campaignsPage.openAddCampaignModal();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.addCampaignModal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.inputCampaignName).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.inputCampaignType).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(campaignsPage.inputCampaignChannel).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new campaign via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should toggle campaign status via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should edit campaign name via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display edit button for each campaign"
    test('should display edit button for each campaign', async () => {
      const campaignIds = await campaignsPage.getAllCampaignIds();
      if (campaignIds.length === 0) {
        test.skip();
        return;
      }

      for (const campaignId of campaignIds) {
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(campaignsPage.getCampaignEditButton(campaignId)).toBeVisible();
      }
    });
  });
});
