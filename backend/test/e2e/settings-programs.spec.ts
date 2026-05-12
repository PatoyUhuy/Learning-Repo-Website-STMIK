import { test, expect } from '@playwright/test';
import { SettingsProgramsPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Settings - Programs Management"
test.describe('Settings - Programs Management', () => {
  let programsPage: SettingsProgramsPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    programsPage = new SettingsProgramsPage(page);
    // Login as admin before each test
    await programsPage.login('admin');
    await programsPage.goto();
    await programsPage.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display programs page with grid"
    test('should display programs page with grid', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.programsGrid).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display add program button"
    test('should display add program button', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.addProgramButton).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display program list from database"
    test('should display program list from database', async () => {
      // Verify at least one program is displayed
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Program Display"
  test.describe('Program Display', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display program details correctly"
    test('should display program details correctly', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      // Check first program displays all required fields
      const firstProgramId = programIds[0];
      await programsPage.expectProgramDisplayed(firstProgramId);

      // Verify additional fields are visible
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.getProgramStatusToggle(firstProgramId)).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.getProgramSpp(firstProgramId)).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.getProgramStudents(firstProgramId)).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display edit and curriculum buttons for each program"
    test('should display edit and curriculum buttons for each program', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      for (const programId of programIds) {
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(programsPage.getProgramEditButton(programId)).toBeVisible();
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(programsPage.getProgramCurriculumButton(programId)).toBeVisible();
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display program code, name, and level"
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

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Program Status"
  test.describe('Program Status', () => {
    // Run status tests serially to avoid race conditions when multiple workers toggle the same prodi
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display status badge for each program"
    test('should display status badge for each program', async () => {
      const programIds = await programsPage.getAllProgramIds();
      expect(programIds.length).toBeGreaterThan(0);

      for (const programId of programIds) {
        const statusBadge = programsPage.getProgramStatusToggle(programId);
        const statusText = await statusBadge.textContent();
        expect(statusText?.trim()).toMatch(/^(Aktif|Nonaktif)$/);
      }
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should toggle program status via HTMX"
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

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should persist status toggle after page reload"
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

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Edit Program"
  test.describe('Edit Program', () => {
    // Run edit tests serially to avoid race conditions when multiple workers edit the same prodi
    test.describe.configure({ mode: 'serial' });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open edit modal with current values"
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
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(programsPage.getEditProgramName(programId)).toHaveValue(currentName?.trim() || '');
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(programsPage.getEditProgramCode(programId)).toHaveValue(currentCode?.trim() || '');
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(programsPage.getEditProgramDegree(programId)).toHaveValue(currentLevel?.trim() || '');
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should update program name via HTMX"
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

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Add Program"
  test.describe('Add Program', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should open add program modal"
    test('should open add program modal', async () => {
      await programsPage.openAddProgramModal();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.addProgramModal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.inputProgramName).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.inputProgramCode).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(programsPage.inputProgramDegree).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should add new program via HTMX"
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
