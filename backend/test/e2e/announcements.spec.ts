import { test, expect } from '@playwright/test';
import { AnnouncementsPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Announcements Management"
test.describe('Admin Announcements Management', () => {
  let announcementsPage: AnnouncementsPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    announcementsPage = new AnnouncementsPage(page);
    // Login as admin before each test
    await announcementsPage.login('admin');
    await announcementsPage.goto();
    await announcementsPage.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display announcements page with section"
    test('should display announcements page with section', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.announcementsSection).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display add announcement button"
    test('should display add announcement button', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.addAnnouncementButton).toBeVisible();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Announcement CRUD"
  test.describe('Announcement CRUD', () => {
    // Run CRUD tests serially to avoid race conditions
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add announcement modal"
    test('should open add announcement modal', async () => {
      await announcementsPage.openAddAnnouncementModal();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.addAnnouncementModal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.inputTitle).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.inputContent).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.selectTargetStatus).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.selectTargetProdi).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new announcement via HTMX"
    test('should add new announcement via HTMX', async ({ page }) => {
      // Generate unique title
      const timestamp = Date.now().toString().slice(-6);
      const newTitle = `Test Announcement ${timestamp}`;
      const newContent = `This is test content for announcement ${timestamp}`;

      // Get current announcement count
      const announcementIdsBefore = await announcementsPage.getAllAnnouncementIds();
      const countBefore = announcementIdsBefore.length;

      // Add new announcement
      await announcementsPage.addAnnouncement(newTitle, newContent);

      // Verify new announcement appears
      const announcementIdsAfter = await announcementsPage.getAllAnnouncementIds();
      expect(announcementIdsAfter.length).toBe(countBefore + 1);

      // Find the new announcement
      const newAnnouncementId = announcementIdsAfter.find(id => !announcementIdsBefore.includes(id));
      expect(newAnnouncementId).toBeTruthy();

      if (newAnnouncementId) {
        await announcementsPage.expectAnnouncementTitleValue(newAnnouncementId, newTitle);
        // New announcements should be draft by default
        await announcementsPage.expectAnnouncementStatusText(newAnnouncementId, 'Draft');

        // Reload and verify persistence
        await page.reload();
        await announcementsPage.expectPageLoaded();
        await announcementsPage.expectAnnouncementDisplayed(newAnnouncementId);
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should publish and unpublish announcement via HTMX"
    test('should publish and unpublish announcement via HTMX', async () => {
      // First create a new announcement to test with
      const timestamp = Date.now().toString().slice(-6);
      const newTitle = `Publish Test ${timestamp}`;
      const newContent = `Content for publish test ${timestamp}`;

      const announcementIdsBefore = await announcementsPage.getAllAnnouncementIds();
      await announcementsPage.addAnnouncement(newTitle, newContent);

      const announcementIdsAfter = await announcementsPage.getAllAnnouncementIds();
      const newAnnouncementId = announcementIdsAfter.find(id => !announcementIdsBefore.includes(id));
      expect(newAnnouncementId).toBeTruthy();

      if (newAnnouncementId) {
        // Verify initial draft status
        await announcementsPage.expectAnnouncementStatusText(newAnnouncementId, 'Draft');

        // Publish announcement
        await announcementsPage.publishAnnouncement(newAnnouncementId);
        await announcementsPage.expectAnnouncementStatusText(newAnnouncementId, 'Terbit');

        // Unpublish announcement
        await announcementsPage.unpublishAnnouncement(newAnnouncementId);
        await announcementsPage.expectAnnouncementStatusText(newAnnouncementId, 'Draft');
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should edit announcement via HTMX"
    test('should edit announcement via HTMX', async ({ page }) => {
      // First create a new announcement to test with
      const timestamp = Date.now().toString().slice(-6);
      const originalTitle = `Edit Test ${timestamp}`;
      const originalContent = `Original content ${timestamp}`;

      const announcementIdsBefore = await announcementsPage.getAllAnnouncementIds();
      await announcementsPage.addAnnouncement(originalTitle, originalContent);

      const announcementIdsAfter = await announcementsPage.getAllAnnouncementIds();
      const newAnnouncementId = announcementIdsAfter.find(id => !announcementIdsBefore.includes(id));
      expect(newAnnouncementId).toBeTruthy();

      if (newAnnouncementId) {
        // Edit the announcement
        const updatedTitle = `${originalTitle} Updated`;
        const updatedContent = `Updated content ${timestamp}`;
        await announcementsPage.editAnnouncement(newAnnouncementId, updatedTitle, updatedContent);

        // Verify title changed
        await announcementsPage.expectAnnouncementTitleValue(newAnnouncementId, updatedTitle);

        // Reload and verify persistence
        await page.reload();
        await announcementsPage.expectPageLoaded();
        await announcementsPage.expectAnnouncementTitleValue(newAnnouncementId, updatedTitle);
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should delete announcement via HTMX"
    test('should delete announcement via HTMX', async () => {
      // First create a new announcement to test with
      const timestamp = Date.now().toString().slice(-6);
      const newTitle = `Delete Test ${timestamp}`;
      const newContent = `Content to delete ${timestamp}`;

      const announcementIdsBefore = await announcementsPage.getAllAnnouncementIds();
      await announcementsPage.addAnnouncement(newTitle, newContent);

      const announcementIdsAfter = await announcementsPage.getAllAnnouncementIds();
      const newAnnouncementId = announcementIdsAfter.find(id => !announcementIdsBefore.includes(id));
      expect(newAnnouncementId).toBeTruthy();

      if (newAnnouncementId) {
        // Delete the announcement
        await announcementsPage.deleteAnnouncement(newAnnouncementId);

        // Verify announcement is removed
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(announcementsPage.getAnnouncementRow(newAnnouncementId)).not.toBeVisible();
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Announcement Targeting"
  test.describe('Announcement Targeting', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add announcement with target status"
    test('should add announcement with target status', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const newTitle = `Targeted Status ${timestamp}`;
      const newContent = `Content for targeted announcement ${timestamp}`;

      const announcementIdsBefore = await announcementsPage.getAllAnnouncementIds();
      await announcementsPage.addAnnouncement(newTitle, newContent, 'registered');

      const announcementIdsAfter = await announcementsPage.getAllAnnouncementIds();
      expect(announcementIdsAfter.length).toBe(announcementIdsBefore.length + 1);
    });
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Navigation to Announcements"
test.describe('Admin Navigation to Announcements', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "should navigate to announcements from sidebar"
  test('should navigate to announcements from sidebar', async ({ page }) => {
    // Login as admin
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);

    // Click announcements link in sidebar
    // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('nav-announcements').click();
    await page.waitForURL(/\/admin\/announcements/);

    // Verify page loaded
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-announcements-page')).toBeVisible();
  });
});
