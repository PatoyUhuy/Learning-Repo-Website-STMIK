import { test, expect } from '@playwright/test';
import { SettingsAssignmentPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Settings - Assignment Algorithm"
test.describe('Settings - Assignment Algorithm', () => {
  let assignmentPage: SettingsAssignmentPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    assignmentPage = new SettingsAssignmentPage(page);
    await assignmentPage.login('admin');
    await assignmentPage.goto();
    await assignmentPage.expectPageLoaded();
  });

  // Baris 18 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Baris 20 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display assignment settings page"
    test('should display assignment settings page', async () => {
      // Baris 22 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(assignmentPage.pageContainer).toBeVisible();
      // Baris 24 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(assignmentPage.algorithmsSection).toBeVisible();
    });

    // Baris 28 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display algorithms list"
    test('should display algorithms list', async () => {
      // Baris 30 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(assignmentPage.algorithmsList).toBeVisible();
    });

    // Baris 34 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display seeded algorithms"
    test('should display seeded algorithms', async () => {
      const algorithmIds = await assignmentPage.getAllAlgorithmIds();
      expect(algorithmIds.length).toBeGreaterThan(0);
    });

    // Baris 40 digunakan untuk: Memulai eksekusi pengujian dengan judul "should have exactly one active algorithm"
    test('should have exactly one active algorithm', async () => {
      const activeId = await assignmentPage.getActiveAlgorithmId();
      expect(activeId).not.toBeNull();
    });
  });

  // Baris 47 digunakan untuk: Mengelompokkan skenario pengujian tentang "Algorithm Display"
  test.describe('Algorithm Display', () => {
    // Baris 49 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display algorithm details"
    test('should display algorithm details', async () => {
      const algorithmIds = await assignmentPage.getAllAlgorithmIds();
      if (algorithmIds.length === 0) {
        test.skip();
        return;
      }

      for (const id of algorithmIds) {
        await assignmentPage.expectAlgorithmDisplayed(id);
        // Baris 59 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(assignmentPage.getAlgorithmCode(id)).toBeVisible();
        // Baris 61 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(assignmentPage.getAlgorithmDescription(id)).toBeVisible();
      }
    });

    // Baris 66 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display activate button for inactive algorithms"
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

  // Baris 81 digunakan untuk: Mengelompokkan skenario pengujian tentang "Algorithm Switching"
  test.describe('Algorithm Switching', () => {
    test.describe.configure({ mode: 'serial' });

    // Baris 85 digunakan untuk: Memulai eksekusi pengujian dengan judul "should switch active algorithm via HTMX"
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

    // Baris 118 digunakan untuk: Memulai eksekusi pengujian dengan judul "should restore original algorithm"
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
