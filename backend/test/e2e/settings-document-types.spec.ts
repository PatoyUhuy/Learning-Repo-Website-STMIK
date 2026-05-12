import { test, expect } from '@playwright/test';
import { SettingsDocumentTypesPage } from './pages/SettingsDocumentTypesPage';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Document Types Settings"
test.describe('Document Types Settings', () => {
  let page: SettingsDocumentTypesPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page: browserPage }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    page = new SettingsDocumentTypesPage(browserPage);
    await page.login('admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "tujuan"
    await page.goto(page.path);
    await page.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Display"
  test.describe('Page Display', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display document types page with seeded data"
    test('should display document types page with seeded data', async () => {
      // Check page structure
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.pageContainer).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.documentTypesSection).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.documentTypesTable).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addDocumentTypeButton).toBeVisible();

      // Should have seeded document types
      const ids = await page.getAllDocumentTypeIds();
      expect(ids.length).toBeGreaterThanOrEqual(4); // 4 seeded types: ktp, photo, ijazah, transcript
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display seeded document types with correct structure"
    test('should display seeded document types with correct structure', async () => {
      const ids = await page.getAllDocumentTypeIds();

      // Find KTP document type
      let ktpId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes('ktp')) {
          ktpId = id;
          break;
        }
      }

      expect(ktpId).not.toBeNull();
      if (ktpId) {
        // Just check that elements are displayed (values may be modified by parallel tests)
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeName(ktpId)).toBeVisible();
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeCode(ktpId)).toContainText('ktp');
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeRequired(ktpId)).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeDefer(ktpId)).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeMaxSize(ktpId)).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should show deferrable status for ijazah"
    test('should show deferrable status for ijazah', async () => {
      const ids = await page.getAllDocumentTypeIds();

      // Find ijazah document type
      let ijazahId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes('ijazah')) {
          ijazahId = id;
          break;
        }
      }

      expect(ijazahId).not.toBeNull();
      if (ijazahId) {
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(ijazahId)).toContainText('Ijazah');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(ijazahId)).toContainText('Ya');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(ijazahId)).toContainText('Ya');
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Add Document Type"
  test.describe('Add Document Type', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add modal when clicking add button"
    test('should open add modal when clicking add button', async () => {
      await page.openAddModal();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addDocumentTypeModal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputName).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputCode).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputDescription).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputMaxSize).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputIsRequired).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputCanDefer).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new document type with all fields"
    test('should add new document type with all fields', async () => {
      const uniqueCode = `recommendation_${Date.now()}`;
      const newDocType = {
        name: 'Surat Rekomendasi',
        code: uniqueCode,
        description: 'Surat rekomendasi dari sekolah atau guru',
        maxFileSizeMB: 3,
        displayOrder: 10,
        isRequired: false,
        canDefer: true
      };

      await page.addDocumentType(newDocType);

      // Modal should close
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addDocumentTypeModal).not.toBeVisible();

      // New document type should appear in list
      const ids = await page.getAllDocumentTypeIds();
      let newId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes(uniqueCode)) {
          newId = id;
          break;
        }
      }

      expect(newId).not.toBeNull();
      if (newId) {
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(newId)).toContainText('Surat Rekomendasi');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeCode(newId)).toContainText(uniqueCode);
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(newId)).toContainText('Tidak');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(newId)).toContainText('Ya');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeMaxSize(newId)).toContainText('3 MB');
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add required document type without defer"
    test('should add required document type without defer', async () => {
      const uniqueCode = `birth_cert_${Date.now()}`;
      const newDocType = {
        name: 'Akta Kelahiran',
        code: uniqueCode,
        maxFileSizeMB: 2,
        isRequired: true,
        canDefer: false
      };

      await page.addDocumentType(newDocType);

      const ids = await page.getAllDocumentTypeIds();
      let newId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes(uniqueCode)) {
          newId = id;
          break;
        }
      }

      expect(newId).not.toBeNull();
      if (newId) {
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(newId)).toContainText('Ya');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(newId)).toContainText('Tidak');
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Edit Document Type"
  test.describe('Edit Document Type', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open edit modal with current values"
    test('should open edit modal with current values', async () => {
      const ids = await page.getAllDocumentTypeIds();
      expect(ids.length).toBeGreaterThan(0);

      const id = ids[0];
      const originalName = await page.getDocumentTypeName(id).textContent();

      await page.openEditModal(id);
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getEditModal(id)).toBeVisible();

      // Check that input has current value
      const inputValue = await page.getEditInputName(id).inputValue();
      expect(inputValue).toBe(originalName?.trim());
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should update document type name"
    test('should update document type name', async () => {
      // Edit a seeded document type (photo)
      const ids = await page.getAllDocumentTypeIds();
      let photoId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes('photo')) {
          photoId = id;
          break;
        }
      }

      expect(photoId).not.toBeNull();
      if (photoId) {
        await page.editDocumentType(photoId, {
          name: 'Pas Foto Updated'
        });

        // Modal should close after successful edit
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getEditModal(photoId).first()).not.toBeVisible();
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(photoId)).toContainText('Pas Foto Updated');
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should update document type max file size"
    test('should update document type max file size', async () => {
      // Edit a seeded document type (ijazah has 5MB default)
      const ids = await page.getAllDocumentTypeIds();
      let ijazahId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes('ijazah')) {
          ijazahId = id;
          break;
        }
      }

      expect(ijazahId).not.toBeNull();
      if (ijazahId) {
        await page.editDocumentType(ijazahId, {
          maxFileSizeMB: 10
        });

        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeMaxSize(ijazahId)).toContainText('10 MB');
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should update required and defer flags"
    test('should update required and defer flags', async () => {
      // Create a new document type to test flag updates (avoids conflicts with parallel tests)
      const uniqueCode = `flag_test_${Date.now()}`;
      await page.addDocumentType({
        name: 'Flag Test Doc',
        code: uniqueCode,
        maxFileSizeMB: 5,
        isRequired: true,
        canDefer: false
      });

      // Reload page to ensure edit modal is properly rendered
      // Kegunaan: Membuka browser dan menavigasi ke halaman "tujuan"
      await page.goto(page.path);
      await page.expectPageLoaded();

      const ids = await page.getAllDocumentTypeIds();
      let testId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes(uniqueCode)) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        // Verify initial state
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(testId)).toContainText('Ya');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(testId)).toContainText('Tidak');

        // Update flags
        await page.editDocumentType(testId, {
          isRequired: false,
          canDefer: true
        });

        // Verify updated state
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(testId)).toContainText('Tidak');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(testId)).toContainText('Ya');
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Toggle Status"
  test.describe('Toggle Status', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should toggle document type from active to inactive"
    test('should toggle document type from active to inactive', async () => {
      // Use a seeded document type (all seeded types are active by default)
      const ids = await page.getAllDocumentTypeIds();
      let testId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes('ktp')) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        // Should be active initially
        await page.expectDocumentTypeActive(testId);

        // Toggle to inactive
        await page.toggleDocumentTypeStatus(testId);
        await page.expectDocumentTypeInactive(testId);

        // Toggle back to active
        await page.toggleDocumentTypeStatus(testId);
        await page.expectDocumentTypeActive(testId);
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should persist status after page reload"
    test('should persist status after page reload', async () => {
      // Create a new document type to avoid conflicts with parallel tests
      const uniqueCode = `toggle_persist_${Date.now()}`;
      await page.addDocumentType({
        name: 'Toggle Persist Test',
        code: uniqueCode,
        maxFileSizeMB: 5
      });

      const ids = await page.getAllDocumentTypeIds();
      let testId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes(uniqueCode)) {
          testId = id;
          break;
        }
      }

      expect(testId).not.toBeNull();
      if (testId) {
        // Toggle to inactive (newly created is active by default)
        await page.toggleDocumentTypeStatus(testId);
        await page.expectDocumentTypeInactive(testId);

        // Reload page
        // Kegunaan: Membuka browser dan menavigasi ke halaman "tujuan"
        await page.goto(page.path);
        await page.expectPageLoaded();

        // Find the same document type again
        const newIds = await page.getAllDocumentTypeIds();
        let persistedId: string | null = null;
        for (const id of newIds) {
          const codeText = await page.getDocumentTypeCode(id).textContent();
          if (codeText?.includes(uniqueCode)) {
            persistedId = id;
            break;
          }
        }

        expect(persistedId).not.toBeNull();
        if (persistedId) {
          // Should still be inactive
          await page.expectDocumentTypeInactive(persistedId);
        }
      }
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Database Persistence"
  test.describe('Database Persistence', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should persist new document type after page reload"
    test('should persist new document type after page reload', async () => {
      const uniqueCode = `persist_${Date.now()}`;
      await page.addDocumentType({
        name: 'Persistence Check',
        code: uniqueCode,
        description: 'Testing persistence',
        maxFileSizeMB: 7
      });

      // Reload page
      // Kegunaan: Membuka browser dan menavigasi ke halaman "tujuan"
      await page.goto(page.path);
      await page.expectPageLoaded();

      // Find the document type
      const ids = await page.getAllDocumentTypeIds();
      let foundId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes(uniqueCode)) {
          foundId = id;
          break;
        }
      }

      expect(foundId).not.toBeNull();
      if (foundId) {
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(foundId)).toContainText('Persistence Check');
        // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeMaxSize(foundId)).toContainText('7 MB');
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should persist edited document type after page reload"
    test('should persist edited document type after page reload', async () => {
      // Edit a seeded document type (transcript)
      const ids = await page.getAllDocumentTypeIds();
      let transcriptId: string | null = null;
      for (const id of ids) {
        const codeText = await page.getDocumentTypeCode(id).textContent();
        if (codeText?.includes('transcript')) {
          transcriptId = id;
          break;
        }
      }

      expect(transcriptId).not.toBeNull();
      if (transcriptId) {
        await page.editDocumentType(transcriptId, {
          name: 'Transkrip Nilai Edited',
          maxFileSizeMB: 8
        });

        // Reload page
        // Kegunaan: Membuka browser dan menavigasi ke halaman "tujuan"
        await page.goto(page.path);
        await page.expectPageLoaded();

        // Find the document type again
        const newIds = await page.getAllDocumentTypeIds();
        let editedId: string | null = null;
        for (const id of newIds) {
          const codeText = await page.getDocumentTypeCode(id).textContent();
          if (codeText?.includes('transcript')) {
            editedId = id;
            break;
          }
        }

        expect(editedId).not.toBeNull();
        if (editedId) {
          // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
          await expect(page.getDocumentTypeName(editedId)).toContainText('Transkrip Nilai Edited');
          // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
          await expect(page.getDocumentTypeMaxSize(editedId)).toContainText('8 MB');
        }
      }
    });
  });
});
