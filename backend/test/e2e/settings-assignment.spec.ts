import { test, expect } from '@playwright/test';
import { SettingsAssignmentPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Settings - Assignment Algorithm"
test.describe('Settings - Assignment Algorithm', () => {
  let assignmentPage: SettingsAssignmentPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    assignmentPage = new SettingsAssignmentPage(page);
    await assignmentPage.login('admin');
    await assignmentPage.goto();
    await assignmentPage.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display assignment settings page"
    test('should display assignment settings page', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(assignmentPage.pageContainer).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(assignmentPage.algorithmsSection).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display algorithms list"
    test('should display algorithms list', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(assignmentPage.algorithmsList).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display seeded algorithms"
    test('should display seeded algorithms', async () => {
      const algorithmIds = await assignmentPage.getAllAlgorithmIds();
      expect(algorithmIds.length).toBeGreaterThan(0);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should have exactly one active algorithm"
    test('should have exactly one active algorithm', async () => {
      const activeId = await assignmentPage.getActiveAlgorithmId();
      expect(activeId).not.toBeNull();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Algorithm Display"
  test.describe('Algorithm Display', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display algorithm details"
    test('should display algorithm details', async () => {
      const algorithmIds = await assignmentPage.getAllAlgorithmIds();
      if (algorithmIds.length === 0) {
        test.skip();
        return;
      }

      for (const id of algorithmIds) {
        await assignmentPage.expectAlgorithmDisplayed(id);
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(assignmentPage.getAlgorithmCode(id)).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(assignmentPage.getAlgorithmDescription(id)).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display activate button for inactive algorithms"
    test('should display activate button for inactive algorithms', async () => {
      const algorithmIds = await assignmentPage.getAllAlgorithmIds();
      const activeId = await assignmentPage.getActiveAlgorithmId();

      for (const id of algorithmIds) {
        if (id === activeId) {
          await assignmentPage.expectAlgorithmActive(id);
        } else {
          await assignmentPage.expectAlgorithmInactive(id);
        }
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Algorithm Switching"
  test.describe('Algorithm Switching', () => {
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should switch active algorithm via HTMX"
    test('should switch active algorithm via HTMX', async ({ page }) => {
      const algorithmIds = await assignmentPage.getAllAlgorithmIds();
      if (algorithmIds.length < 2) {
        test.skip();
        return;
      }

      // Get current active algorithm
      const activeIdBefore = await assignmentPage.getActiveAlgorithmId();
      expect(activeIdBefore).not.toBeNull();

      // Find an inactive algorithm
      const inactiveId = algorithmIds.find(id => id !== activeIdBefore);
      expect(inactiveId).toBeDefined();

      // Activate the inactive algorithm
      await assignmentPage.activateAlgorithm(inactiveId!);

      // Verify the new algorithm is active
      await assignmentPage.expectAlgorithmActive(inactiveId!);

      // Verify the old algorithm is now inactive
      await assignmentPage.expectAlgorithmInactive(activeIdBefore!);

      // Reload and verify persistence
      await page.reload();
      await assignmentPage.expectPageLoaded();

      const activeIdAfter = await assignmentPage.getActiveAlgorithmId();
      expect(activeIdAfter).toBe(inactiveId);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should restore original algorithm"
    test('should restore original algorithm', async ({ page }) => {
      // This test switches back to round_robin to restore state
      const algorithmIds = await assignmentPage.getAllAlgorithmIds();
      if (algorithmIds.length === 0) {
        test.skip();
        return;
      }

      // Find round_robin algorithm by checking code
      let roundRobinId: string | null = null;
      for (const id of algorithmIds) {
        const code = await assignmentPage.getAlgorithmCode(id).textContent();
        if (code === 'round_robin') {
          roundRobinId = id;
          break;
        }
      }

      if (!roundRobinId) {
        test.skip();
        return;
      }

      const activeId = await assignmentPage.getActiveAlgorithmId();
      if (activeId === roundRobinId) {
        // Already active, no need to switch
        return;
      }

      // Activate round_robin
      await assignmentPage.activateAlgorithm(roundRobinId);
      await assignmentPage.expectAlgorithmActive(roundRobinId);

      // Verify persistence
      await page.reload();
      await assignmentPage.expectPageLoaded();
      await assignmentPage.expectAlgorithmActive(roundRobinId);
    });
  });
});
