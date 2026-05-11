import { test, expect } from '@playwright/test';
import { SettingsLostReasonsPage } from './pages/SettingsLostReasonsPage';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Settings - Lost Reasons"
test.describe('Settings - Lost Reasons', () => {
  let page: SettingsLostReasonsPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page: browserPage }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    page = new SettingsLostReasonsPage(browserPage);
    await page.login('admin');
    // Baris 14 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
    await page.goto(page.path);
    await page.expectPageLoaded();
  });

  // Baris 19 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Display"
  test.describe('Page Display', () => {
    // Baris 21 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display lost reasons page with seeded data"
    test('should display lost reasons page with seeded data', async () => {
      // Check page structure
      // Baris 24 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.pageContainer).toBeVisible();
      // Baris 26 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.lostReasonsSection).toBeVisible();
      // Baris 28 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.lostReasonsList).toBeVisible();
      // Baris 30 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addLostReasonButton).toBeVisible();

      // Should have seeded lost reasons
      const ids = await page.getAllLostReasonIds();
      expect(ids.length).toBeGreaterThanOrEqual(8); // 8 seeded reasons
    });

    // Baris 38 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display seeded lost reasons with correct structure"
    test('should display seeded lost reasons with correct structure', async () => {
      const ids = await page.getAllLostReasonIds();

      // Find "Tidak ada respon" reason
      let targetId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes('Tidak ada respon')) {
          targetId = id;
          break;
        }
      }

      expect(targetId).not.toBeNull();
      if (targetId) {
        // Baris 54 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getLostReasonName(targetId)).toBeVisible();
        // Baris 56 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getLostReasonStatusToggle(targetId)).toBeVisible();
        // Baris 58 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getLostReasonEditButton(targetId)).toBeVisible();
      }
    });

    // Baris 63 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display description for reasons that have one"
    test('should display description for reasons that have one', async () => {
      const ids = await page.getAllLostReasonIds();

      // Find reason with description
      let reasonWithDesc: string | null = null;
      for (const id of ids) {
        try {
          const descElement = page.getLostReasonDescription(id);
          if (await descElement.isVisible()) {
            reasonWithDesc = id;
            break;
          }
        } catch {
          // Element not found, continue
        }
      }

      // At least one seeded reason should have a description
      expect(reasonWithDesc).not.toBeNull();
    });
  });

  // Baris 86 digunakan untuk: Mengelompokkan skenario pengujian tentang "Add Lost Reason"
  test.describe('Add Lost Reason', () => {
    // Baris 88 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add modal when clicking add button"
    test('should open add modal when clicking add button', async () => {
      await page.openAddModal();
      // Baris 91 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addLostReasonModal).toBeVisible();
      // Baris 93 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputName).toBeVisible();
      // Baris 95 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputDescription).toBeVisible();
      // Baris 97 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputDisplayOrder).toBeVisible();
    });

    // Baris 101 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new lost reason with all fields"
    test('should add new lost reason with all fields', async () => {
      const uniqueName = `Test Reason ${Date.now()}`;
      const newReason = {
        name: uniqueName,
        description: 'Alasan untuk testing',
        displayOrder: 50
      };

      await page.addLostReason(newReason);

      // Modal should close
      // Baris 113 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addLostReasonModal).not.toBeVisible();

      // New lost reason should appear in list
      const ids = await page.getAllLostReasonIds();
      let newId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          newId = id;
          break;
        }
      }

      expect(newId).not.toBeNull();
      if (newId) {
        // Baris 129 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getLostReasonName(newId)).toContainText(uniqueName);
        // Baris 131 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getLostReasonDescription(newId)).toContainText('Alasan untuk testing');
      }
    });

    // Baris 136 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add lost reason without description"
    test('should add lost reason without description', async () => {
      const uniqueName = `No Desc Reason ${Date.now()}`;
      const newReason = {
        name: uniqueName,
        displayOrder: 60
      };

      await page.addLostReason(newReason);

      const ids = await page.getAllLostReasonIds();
      let newId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          newId = id;
          break;
        }
      }

      expect(newId).not.toBeNull();
      if (newId) {
        // Baris 158 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getLostReasonName(newId)).toContainText(uniqueName);
      }
    });
  });

  // Baris 164 digunakan untuk: Mengelompokkan skenario pengujian tentang "Edit Lost Reason"
  test.describe('Edit Lost Reason', () => {
    // Baris 166 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open edit modal with current values"
    test('should open edit modal with current values', async () => {
      const ids = await page.getAllLostReasonIds();
      expect(ids.length).toBeGreaterThan(0);

      const id = ids[0];
      const originalName = await page.getLostReasonName(id).textContent();

      await page.openEditModal(id);
      // Baris 175 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getEditModal(id)).toBeVisible();

      // Check that input has current value
      const inputValue = await page.getEditInputName(id).inputValue();
      expect(inputValue).toBe(originalName?.trim());
    });

    // Baris 183 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update lost reason name"
    test('should update lost reason name', async () => {
      // Create a new reason to edit (avoids conflicts with parallel tests)
      const uniqueName = `Edit Test ${Date.now()}`;
      await page.addLostReason({ name: uniqueName });

      // Reload to get proper edit modal
      // Baris 190 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
      await page.goto(page.path);
      await page.expectPageLoaded();

      const ids = await page.getAllLostReasonIds();
      let testId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        await page.editLostReason(testId, {
          name: `${uniqueName} Updated`
        });

        // Baris 210 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getEditModal(testId).first()).not.toBeVisible();
        // Baris 212 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getLostReasonName(testId)).toContainText('Updated');
      }
    });

    // Baris 217 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update lost reason description"
    test('should update lost reason description', async () => {
      // Create a new reason to edit
      const uniqueName = `Desc Edit Test ${Date.now()}`;
      await page.addLostReason({ name: uniqueName, description: 'Original' });

      // Baris 223 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
      await page.goto(page.path);
      await page.expectPageLoaded();

      const ids = await page.getAllLostReasonIds();
      let testId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        await page.editLostReason(testId, {
          description: 'Updated description'
        });

        // Baris 243 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getLostReasonDescription(testId)).toContainText('Updated description');
      }
    });
  });

  // Baris 249 digunakan untuk: Mengelompokkan skenario pengujian tentang "Toggle Status"
  test.describe('Toggle Status', () => {
    // Baris 251 digunakan untuk: Memulai eksekusi pengujian dengan judul "should toggle lost reason from active to inactive"
    test('should toggle lost reason from active to inactive', async () => {
      // Create a new reason to toggle
      const uniqueName = `Toggle Test ${Date.now()}`;
      await page.addLostReason({ name: uniqueName });

      const ids = await page.getAllLostReasonIds();
      let testId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        // Should be active initially
        await page.expectLostReasonActive(testId);

        // Toggle to inactive
        await page.toggleLostReasonStatus(testId);
        await page.expectLostReasonInactive(testId);

        // Toggle back to active
        await page.toggleLostReasonStatus(testId);
        await page.expectLostReasonActive(testId);
      }
    });

    // Baris 282 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist status after page reload"
    test('should persist status after page reload', async () => {
      // Create a new reason
      const uniqueName = `Persist Toggle ${Date.now()}`;
      await page.addLostReason({ name: uniqueName });

      const ids = await page.getAllLostReasonIds();
      let testId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        // Toggle to inactive
        await page.toggleLostReasonStatus(testId);
        await page.expectLostReasonInactive(testId);

        // Reload page
        // Baris 305 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
        await page.goto(page.path);
        await page.expectPageLoaded();

        // Find the same reason again
        const newIds = await page.getAllLostReasonIds();
        let persistedId: string | null = null;
        for (const id of newIds) {
          const nameText = await page.getLostReasonName(id).textContent();
          if (nameText?.includes(uniqueName)) {
            persistedId = id;
            break;
          }
        }

        expect(persistedId).not.toBeNull();
        if (persistedId) {
          await page.expectLostReasonInactive(persistedId);
        }
      }
    });
  });

  // Baris 328 digunakan untuk: Mengelompokkan skenario pengujian tentang "Database Persistence"
  test.describe('Database Persistence', () => {
    // Baris 330 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist new lost reason after page reload"
    test('should persist new lost reason after page reload', async () => {
      const uniqueName = `Persist Test ${Date.now()}`;
      await page.addLostReason({
        name: uniqueName,
        description: 'Testing persistence'
      });

      // Reload page
      // Baris 339 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
      await page.goto(page.path);
      await page.expectPageLoaded();

      // Find the reason
      const ids = await page.getAllLostReasonIds();
      let foundId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          foundId = id;
          break;
        }
      }

      expect(foundId).not.toBeNull();
      if (foundId) {
        // Baris 356 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getLostReasonName(foundId)).toContainText(uniqueName);
        // Baris 358 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getLostReasonDescription(foundId)).toContainText('Testing persistence');
      }
    });

    // Baris 363 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist edited lost reason after page reload"
    test('should persist edited lost reason after page reload', async () => {
      // Create then edit
      const uniqueName = `Edit Persist ${Date.now()}`;
      await page.addLostReason({ name: uniqueName });

      // Baris 369 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
      await page.goto(page.path);
      await page.expectPageLoaded();

      const ids = await page.getAllLostReasonIds();
      let testId: string | null = null;
      for (const id of ids) {
        const nameText = await page.getLostReasonName(id).textContent();
        if (nameText?.includes(uniqueName)) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        await page.editLostReason(testId, {
          name: `${uniqueName} Final`,
          description: 'Edited description'
        });

        // Reload page
        // Baris 391 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
        await page.goto(page.path);
        await page.expectPageLoaded();

        // Find the reason again
        const newIds = await page.getAllLostReasonIds();
        let editedId: string | null = null;
        for (const id of newIds) {
          const nameText = await page.getLostReasonName(id).textContent();
          if (nameText?.includes(`${uniqueName} Final`)) {
            editedId = id;
            break;
          }
        }

        expect(editedId).not.toBeNull();
        if (editedId) {
          // Baris 408 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
          await expect(page.getLostReasonName(editedId)).toContainText('Final');
          // Baris 410 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
          await expect(page.getLostReasonDescription(editedId)).toContainText('Edited description');
        }
      }
    });
  });
});
