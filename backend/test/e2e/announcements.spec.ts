import { test, expect } from '@playwright/test';
import { AnnouncementsPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Admin Announcements Management"
test.describe('Admin Announcements Management', () => {
  let announcementsPage: AnnouncementsPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    announcementsPage = new AnnouncementsPage(page);
    // Login as admin before each test
    await announcementsPage.login('admin');
    await announcementsPage.goto();
    await announcementsPage.expectPageLoaded();
  });

  // Baris 19 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Baris 21 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display announcements page with section"
    test('should display announcements page with section', async () => {
      // Baris 23 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.announcementsSection).toBeVisible();
    });

    // Baris 27 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display add announcement button"
    test('should display add announcement button', async () => {
      // Baris 29 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.addAnnouncementButton).toBeVisible();
    });
  });

  // Baris 34 digunakan untuk: Mengelompokkan skenario pengujian tentang "Announcement CRUD"
  test.describe('Announcement CRUD', () => {
    // Run CRUD tests serially to avoid race conditions
    test.describe.configure({ mode: 'serial' });

    // Baris 39 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add announcement modal"
    test('should open add announcement modal', async () => {
      await announcementsPage.openAddAnnouncementModal();
      // Baris 42 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.addAnnouncementModal).toBeVisible();
      // Baris 44 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.inputTitle).toBeVisible();
      // Baris 46 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.inputContent).toBeVisible();
      // Baris 48 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.selectTargetStatus).toBeVisible();
      // Baris 50 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(announcementsPage.selectTargetProdi).toBeVisible();
    });

    // Baris 54 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new announcement via HTMX"
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

    // Baris 88 digunakan untuk: Memulai eksekusi pengujian dengan judul "should publish and unpublish announcement via HTMX"
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

    // Baris 116 digunakan untuk: Memulai eksekusi pengujian dengan judul "should edit announcement via HTMX"
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

    // Baris 146 digunakan untuk: Memulai eksekusi pengujian dengan judul "should delete announcement via HTMX"
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
        // Baris 165 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(announcementsPage.getAnnouncementRow(newAnnouncementId)).not.toBeVisible();
      }
    });
  });

  // Baris 171 digunakan untuk: Mengelompokkan skenario pengujian tentang "Announcement Targeting"
  test.describe('Announcement Targeting', () => {
    // Baris 173 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add announcement with target status"
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

// Baris 188 digunakan untuk: Mengelompokkan skenario pengujian tentang "Admin Navigation to Announcements"
test.describe('Admin Navigation to Announcements', () => {
  // Baris 190 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to announcements from sidebar"
  test('should navigate to announcements from sidebar', async ({ page }) => {
    // Login as admin
    // Baris 193 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);

    // Click announcements link in sidebar
    // Baris 198 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
    await page.getByTestId('nav-announcements').click();
    await page.waitForURL(/\/admin\/announcements/);

    // Verify page loaded
    // Baris 203 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('settings-announcements-page')).toBeVisible();
  });
});
