import { test, expect } from '@playwright/test';
import { SettingsProgramsPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Settings - Programs Management"
test.describe('Settings - Programs Management', () => {
  let programsPage: SettingsProgramsPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    programsPage = new SettingsProgramsPage(page);
    // Login as admin before each test
    await programsPage.login('admin');
    await programsPage.goto();
    await programsPage.expectPageLoaded();
  });

  // Baris 19 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Baris 21 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display programs page with grid"
    test('should display programs page with grid', async () => {
      // Baris 23 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.programsGrid).toBeVisible();
    });

    // Baris 27 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display add program button"
    test('should display add program button', async () => {
      // Baris 29 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.addProgramButton).toBeVisible();
    });

    // Baris 33 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display program list from database"
    test('should display program list from database', async () => {
      // Verify at least one program is displayed
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);
    });
  });

  // Baris 41 digunakan untuk: Mengelompokkan skenario pengujian tentang "Program Display"
  test.describe('Program Display', () => {
    // Baris 43 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display program details correctly"
    test('should display program details correctly', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      // Check first program displays all required fields
      const firstProgramId = programIds[0];
      await programsPage.expectProgramDisplayed(firstProgramId);

      // Verify additional fields are visible
      // Baris 53 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.getProgramStatusToggle(firstProgramId)).toBeVisible();
      // Baris 55 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.getProgramSpp(firstProgramId)).toBeVisible();
      // Baris 57 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.getProgramStudents(firstProgramId)).toBeVisible();
    });

    // Baris 61 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display edit and curriculum buttons for each program"
    test('should display edit and curriculum buttons for each program', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      for (const programId of programIds) {
        // Baris 67 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(programsPage.getProgramEditButton(programId)).toBeVisible();
        // Baris 69 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(programsPage.getProgramCurriculumButton(programId)).toBeVisible();
      }
    });

    // Baris 74 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display program code, name, and level"
    test('should display program code, name, and level', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      for (const programId of programIds) {
        const code = await programsPage.getProgramCode(programId).textContent();
        const name = await programsPage.getProgramName(programId).textContent();
        const level = await programsPage.getProgramLevel(programId).textContent();

        expect(code).toBeTruthy();
        expect(name).toBeTruthy();
        expect(level).toBeTruthy();
        expect(level).toMatch(/^(S1|D3)$/);
      }
    });
  });

  // Baris 92 digunakan untuk: Mengelompokkan skenario pengujian tentang "Program Status"
  test.describe('Program Status', () => {
    // Run status tests serially to avoid race conditions when multiple workers toggle the same prodi
    test.describe.configure({ mode: 'serial' });

    // Baris 97 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display status badge for each program"
    test('should display status badge for each program', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      for (const programId of programIds) {
        const statusBadge = programsPage.getProgramStatusToggle(programId);
        const statusText = await statusBadge.textContent();
        expect(statusText?.trim()).toMatch(/^(Aktif|Nonaktif)$/);
      }
    });

    // Baris 109 digunakan untuk: Memulai eksekusi pengujian dengan judul "should toggle program status via HTMX"
    test('should toggle program status via HTMX', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      const programId = programIds[0];

      // Get current status
      const statusBefore = await programsPage.getProgramStatusToggle(programId).textContent();
      const isActiveBefore = statusBefore?.trim() === 'Aktif';

      // Toggle status
      await programsPage.toggleProgramStatus(programId);

      // Verify status changed
      if (isActiveBefore) {
        await programsPage.expectProgramStatus(programId, 'inactive');
      } else {
        await programsPage.expectProgramStatus(programId, 'active');
      }

      // Toggle back to restore original state
      await programsPage.toggleProgramStatus(programId);

      // Verify status restored
      if (isActiveBefore) {
        await programsPage.expectProgramStatus(programId, 'active');
      } else {
        await programsPage.expectProgramStatus(programId, 'inactive');
      }
    });

    // Baris 141 digunakan untuk: Memulai eksekusi pengujian dengan judul "should persist status toggle after page reload"
    test('should persist status toggle after page reload', async ({ page }) => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      const programId = programIds[0];

      // Get current status
      const statusBefore = await programsPage.getProgramStatusToggle(programId).textContent();
      const isActiveBefore = statusBefore?.trim() === 'Aktif';

      // Toggle status
      await programsPage.toggleProgramStatus(programId);

      // Reload page
      await page.reload();
      await programsPage.expectPageLoaded();

      // Verify status persisted
      if (isActiveBefore) {
        await programsPage.expectProgramStatus(programId, 'inactive');
      } else {
        await programsPage.expectProgramStatus(programId, 'active');
      }

      // Toggle back to restore original state
      await programsPage.toggleProgramStatus(programId);
    });
  });

  // Baris 171 digunakan untuk: Mengelompokkan skenario pengujian tentang "Edit Program"
  test.describe('Edit Program', () => {
    // Run edit tests serially to avoid race conditions when multiple workers edit the same prodi
    test.describe.configure({ mode: 'serial' });

    // Baris 176 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open edit modal with current values"
    test('should open edit modal with current values', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      const programId = programIds[0];

      // Get current values
      const currentName = await programsPage.getProgramName(programId).textContent();
      const currentCode = await programsPage.getProgramCode(programId).textContent();
      const currentLevel = await programsPage.getProgramLevel(programId).textContent();

      // Open edit modal
      await programsPage.openEditProgramModal(programId);

      // Verify modal shows current values
      // Baris 192 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(programsPage.getEditProgramName(programId)).toHaveValue(currentName?.trim() || '');
      // Baris 194 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(programsPage.getEditProgramCode(programId)).toHaveValue(currentCode?.trim() || '');
      // Baris 196 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(programsPage.getEditProgramDegree(programId)).toHaveValue(currentLevel?.trim() || '');
    });

    // Baris 200 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update program name via HTMX"
    test('should update program name via HTMX', async ({ page }) => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      const programId = programIds[0];

      // Get current values
      const currentName = await programsPage.getProgramName(programId).textContent();
      const currentCode = await programsPage.getProgramCode(programId).textContent();
      const currentLevel = await programsPage.getProgramLevel(programId).textContent();

      // Edit with new name
      const newName = `${currentName?.trim()} Updated`;
      await programsPage.editProgram(programId, newName, currentCode?.trim() || '', currentLevel?.trim() as 'S1' | 'D3');

      // Verify name changed
      await programsPage.expectProgramName(programId, newName);

      // Reload and verify persistence
      await page.reload();
      await programsPage.expectPageLoaded();
      await programsPage.expectProgramName(programId, newName);

      // Restore original name
      await programsPage.editProgram(programId, currentName?.trim() || '', currentCode?.trim() || '', currentLevel?.trim() as 'S1' | 'D3');
    });
  });

  // Baris 229 digunakan untuk: Mengelompokkan skenario pengujian tentang "Add Program"
  test.describe('Add Program', () => {
    // Baris 231 digunakan untuk: Memulai eksekusi pengujian dengan judul "should open add program modal"
    test('should open add program modal', async () => {
      await programsPage.openAddProgramModal();
      // Baris 234 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.addProgramModal).toBeVisible();
      // Baris 236 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.inputProgramName).toBeVisible();
      // Baris 238 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.inputProgramCode).toBeVisible();
      // Baris 240 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.inputProgramDegree).toBeVisible();
    });

    // Baris 244 digunakan untuk: Memulai eksekusi pengujian dengan judul "should add new program via HTMX"
    test('should add new program via HTMX', async ({ page }) => {
      // Generate unique code to avoid conflicts
      const timestamp = Date.now().toString().slice(-4);
      const newCode = `T${timestamp}`;
      const newName = `Test Program ${timestamp}`;

      // Get current program count
      const programIdsBefore = await programsPage.getAllProgramIds();
      const countBefore = programIdsBefore.length;

      // Add new program
      await programsPage.addProgram(newName, newCode, 'S1');

      // Verify new program appears (program count increased)
      const programIdsAfter = await programsPage.getAllProgramIds();
      expect(programIdsAfter.length).toBe(countBefore + 1);

      // Find the new program by looking for a card not in the before list
      const newProgramId = programIdsAfter.find(id => !programIdsBefore.includes(id));
      expect(newProgramId).toBeTruthy();

      if (newProgramId) {
        // Verify the new program has correct values
        await programsPage.expectProgramName(newProgramId, newName);
        await programsPage.expectProgramCode(newProgramId, newCode);
        await programsPage.expectProgramLevel(newProgramId, 'S1');

        // Reload and verify persistence
        await page.reload();
        await programsPage.expectPageLoaded();

        // Verify program still exists after reload
        await programsPage.expectProgramDisplayed(newProgramId);
        await programsPage.expectProgramName(newProgramId, newName);
      }
    });
  });
});
