import { test, expect } from '@playwright/test';
import { SettingsDocumentTypesPage } from './pages/SettingsDocumentTypesPage';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Document Types Settings"
test.describe('Document Types Settings', () => {
  let page: SettingsDocumentTypesPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page: browserPage }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    page = new SettingsDocumentTypesPage(browserPage);
    await page.login('admin');
    // Baris 14 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
    await page.goto(page.path);
    await page.expectPageLoaded();
  });

  // Baris 19 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Display"
  test.describe('Page Display', () => {
    // Baris 21 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display document types page with seeded data"
    test('should display document types page with seeded data', async () => {
      // Check page structure
      // Baris 24 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.pageContainer).toBeVisible();
      // Baris 26 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.documentTypesSection).toBeVisible();
      // Baris 28 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.documentTypesTable).toBeVisible();
      // Baris 30 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addDocumentTypeButton).toBeVisible();

      // Should have seeded document types
      const ids = await page.getAllDocumentTypeIds();
      expect(ids.length).toBeGreaterThanOrEqual(4); // 4 seeded types: ktp, photo, ijazah, transcript
    });

    // Baris 38 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display seeded document types with correct structure"
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
        // Baris 55 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeName(ktpId)).toBeVisible();
        // Baris 57 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeCode(ktpId)).toContainText('ktp');
        // Baris 59 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeRequired(ktpId)).toBeVisible();
        // Baris 61 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeDefer(ktpId)).toBeVisible();
        // Baris 63 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getDocumentTypeMaxSize(ktpId)).toBeVisible();
      }
    });

    // Baris 68 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show deferrable status for ijazah"
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
        // Baris 84 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(ijazahId)).toContainText('Ijazah');
        // Baris 86 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(ijazahId)).toContainText('Ya');
        // Baris 88 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(ijazahId)).toContainText('Ya');
      }
    });
  });

  // Baris 94 digunakan untuk: Mengelompokkan skenario pengujian tentang "Add Document Type"
  test.describe('Add Document Type', () => {
    // Baris 96 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add modal when clicking add button"
    test('should open add modal when clicking add button', async () => {
      await page.openAddModal();
      // Baris 99 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.addDocumentTypeModal).toBeVisible();
      // Baris 101 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputName).toBeVisible();
      // Baris 103 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputCode).toBeVisible();
      // Baris 105 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputDescription).toBeVisible();
      // Baris 107 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputMaxSize).toBeVisible();
      // Baris 109 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputIsRequired).toBeVisible();
      // Baris 111 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.inputCanDefer).toBeVisible();
    });

    // Baris 115 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new document type with all fields"
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
      // Baris 131 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
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
        // Baris 147 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(newId)).toContainText('Surat Rekomendasi');
        // Baris 149 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeCode(newId)).toContainText(uniqueCode);
        // Baris 151 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(newId)).toContainText('Tidak');
        // Baris 153 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(newId)).toContainText('Ya');
        // Baris 155 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeMaxSize(newId)).toContainText('3 MB');
      }
    });

    // Baris 160 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add required document type without defer"
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
        // Baris 185 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(newId)).toContainText('Ya');
        // Baris 187 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(newId)).toContainText('Tidak');
      }
    });
  });

  // Baris 193 digunakan untuk: Mengelompokkan skenario pengujian tentang "Edit Document Type"
  test.describe('Edit Document Type', () => {
    // Baris 195 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open edit modal with current values"
    test('should open edit modal with current values', async () => {
      const ids = await page.getAllDocumentTypeIds();
      expect(ids.length).toBeGreaterThan(0);

      const id = ids[0];
      const originalName = await page.getDocumentTypeName(id).textContent();

      await page.openEditModal(id);
      // Baris 204 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getEditModal(id)).toBeVisible();

      // Check that input has current value
      const inputValue = await page.getEditInputName(id).inputValue();
      expect(inputValue).toBe(originalName?.trim());
    });

    // Baris 212 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update document type name"
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
        // Baris 232 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(page.getEditModal(photoId).first()).not.toBeVisible();
        // Baris 234 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(photoId)).toContainText('Pas Foto Updated');
      }
    });

    // Baris 239 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update document type max file size"
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

        // Baris 258 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeMaxSize(ijazahId)).toContainText('10 MB');
      }
    });

    // Baris 263 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update required and defer flags"
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
      // Baris 276 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
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
        // Baris 293 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(testId)).toContainText('Ya');
        // Baris 295 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(testId)).toContainText('Tidak');

        // Update flags
        await page.editDocumentType(testId, {
          isRequired: false,
          canDefer: true
        });

        // Verify updated state
        // Baris 305 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeRequired(testId)).toContainText('Tidak');
        // Baris 307 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeDefer(testId)).toContainText('Ya');
      }
    });
  });

  // Baris 313 digunakan untuk: Mengelompokkan skenario pengujian tentang "Toggle Status"
  test.describe('Toggle Status', () => {
    // Baris 315 digunakan untuk: Memulai eksekusi pengujian dengan judul "should toggle document type from active to inactive"
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

    // Baris 343 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist status after page reload"
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
        // Baris 370 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
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

  // Baris 394 digunakan untuk: Mengelompokkan skenario pengujian tentang "Database Persistence"
  test.describe('Database Persistence', () => {
    // Baris 396 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist new document type after page reload"
    test('should persist new document type after page reload', async () => {
      const uniqueCode = `persist_${Date.now()}`;
      await page.addDocumentType({
        name: 'Persistence Check',
        code: uniqueCode,
        description: 'Testing persistence',
        maxFileSizeMB: 7
      });

      // Reload page
      // Baris 407 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
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
        // Baris 424 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeName(foundId)).toContainText('Persistence Check');
        // Baris 426 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
        await expect(page.getDocumentTypeMaxSize(foundId)).toContainText('7 MB');
      }
    });

    // Baris 431 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist edited document type after page reload"
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
        // Baris 452 digunakan untuk: Membuka browser dan menavigasi ke halaman "tujuan"
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
          // Baris 469 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
          await expect(page.getDocumentTypeName(editedId)).toContainText('Transkrip Nilai Edited');
          // Baris 471 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
          await expect(page.getDocumentTypeMaxSize(editedId)).toContainText('8 MB');
        }
      }
    });
  });
});
