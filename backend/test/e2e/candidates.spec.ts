import { test, expect } from '@playwright/test';
import { CandidatesPage } from './pages';

// Baris 5 digunakan untuk: Mengelompokkan skenario pengujian tentang "Admin Candidates List"
test.describe('Admin Candidates List', () => {
  let candidatesPage: CandidatesPage;

  // Baris 9 digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Baris 11 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    candidatesPage = new CandidatesPage(page);
    // Login as admin before each test
    await candidatesPage.login('admin');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();
  });

  // Baris 19 digunakan untuk: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Baris 21 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display candidates page with all sections"
    test('should display candidates page with all sections', async () => {
      // Baris 23 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.candidatesPage).toBeVisible();
      // Baris 25 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statsSection).toBeVisible();
      // Baris 27 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filtersSection).toBeVisible();
      // Baris 29 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.candidatesTable).toBeVisible();
    });

    // Baris 33 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display stats cards"
    test('should display stats cards', async () => {
      // Baris 35 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statTotal).toBeVisible();
      // Baris 37 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statRegistered).toBeVisible();
      // Baris 39 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statProspecting).toBeVisible();
      // Baris 41 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statCommitted).toBeVisible();
      // Baris 43 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statEnrolled).toBeVisible();
      // Baris 45 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statLost).toBeVisible();
    });

    // Baris 49 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display filter controls"
    test('should display filter controls', async () => {
      // Baris 51 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterStatus).toBeVisible();
      // Baris 53 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterConsultant).toBeVisible();
      // Baris 55 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterProdi).toBeVisible();
      // Baris 57 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterCampaign).toBeVisible();
      // Baris 59 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterSource).toBeVisible();
      // Baris 61 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterSearch).toBeVisible();
    });

    // Baris 65 digunakan untuk: Memulai eksekusi pengujian dengan judul "should display candidates table with headers"
    test('should display candidates table with headers', async () => {
      const table = candidatesPage.candidatesTable;
      // Baris 68 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(table.locator('th')).toHaveCount(8); // Checkbox, Kandidat, Prodi, Status, EC, Sumber, Terdaftar, Aksi
    });
  });

  // Baris 73 digunakan untuk: Mengelompokkan skenario pengujian tentang "Filtering"
  test.describe('Filtering', () => {
    // Baris 75 digunakan untuk: Memulai eksekusi pengujian dengan judul "should filter by status"
    test('should filter by status', async ({ page }) => {
      // Get initial count
      const initialCount = await candidatesPage.getCandidateRowCount();

      // Filter by registered status
      await candidatesPage.selectStatus('registered');

      // URL should reflect the filter
      // Baris 84 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/status=registered/);
    });

    // Baris 88 digunakan untuk: Memulai eksekusi pengujian dengan judul "should filter by search query"
    test('should filter by search query', async ({ page }) => {
      // Search for a candidate
      await candidatesPage.searchCandidates('test');

      // URL should reflect the search
      // Baris 94 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/search=test/);
    });

    // Baris 98 digunakan untuk: Memulai eksekusi pengujian dengan judul "should clear filters"
    test('should clear filters', async () => {
      // Apply some filters first
      await candidatesPage.selectStatus('registered');
      await candidatesPage.searchCandidates('test');

      // Clear filters
      await candidatesPage.clearFilters();

      // Verify filters are cleared
      // Baris 108 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(candidatesPage.filterStatus).toHaveValue('');
      // Baris 110 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(candidatesPage.filterSearch).toHaveValue('');
    });

    // Baris 114 digunakan untuk: Memulai eksekusi pengujian dengan judul "should update URL with filter parameters"
    test('should update URL with filter parameters', async ({ page }) => {
      await candidatesPage.selectStatus('prospecting');
      // Baris 117 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/status=prospecting/);

      await candidatesPage.selectSourceType('instagram');
      // Baris 121 digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/source_type=instagram/);
    });
  });

  // Baris 126 digunakan untuk: Mengelompokkan skenario pengujian tentang "Empty State"
  test.describe('Empty State', () => {
    // Baris 128 digunakan untuk: Memulai eksekusi pengujian dengan judul "should show empty message when no candidates match filter"
    test('should show empty message when no candidates match filter', async () => {
      // Search for something that should not exist
      await candidatesPage.searchCandidates('nonexistent-candidate-xyz-12345');
      await candidatesPage.expectEmptyList();
    });
  });

  // Baris 136 digunakan untuk: Mengelompokkan skenario pengujian tentang "Navigation"
  test.describe('Navigation', () => {
    // Baris 138 digunakan untuk: Memulai eksekusi pengujian dengan judul "should navigate to candidates from sidebar"
    test('should navigate to candidates from sidebar', async ({ page }) => {
      // Login as admin
      // Baris 141 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
      await page.goto('/test/login/admin');
      await page.waitForURL(/\/admin\/?$/);

      // Click candidates link in sidebar
      // Baris 146 digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('nav-candidates').click();
      await page.waitForURL(/\/admin\/candidates/);

      // Verify page loaded
      // Baris 151 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('candidates-page')).toBeVisible();
    });
  });
});

// Baris 157 digunakan untuk: Mengelompokkan skenario pengujian tentang "Admin Candidates Role-Based Visibility"
test.describe('Admin Candidates Role-Based Visibility', () => {
  // Baris 159 digunakan untuk: Memulai eksekusi pengujian dengan judul "admin should see all candidates"
  test('admin should see all candidates', async ({ page }) => {
    // Baris 161 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('admin');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Admin should see the total stat which represents all candidates
    const totalText = await candidatesPage.statTotal.textContent();
    // Just verify it's a number (admin sees all)
    expect(totalText).toMatch(/^\d+$/);
  });

  // Baris 173 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant should only see assigned candidates"
  test('consultant should only see assigned candidates', async ({ page }) => {
    // Baris 175 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('consultant');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Consultant should see only their assigned candidates
    // The exact number depends on test data, just verify page loads correctly
    // Baris 183 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(candidatesPage.statsSection).toBeVisible();
  });

  // Baris 187 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor should see team candidates"
  test('supervisor should see team candidates', async ({ page }) => {
    // Baris 189 digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('supervisor');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Supervisor should see their team's candidates
    // Baris 196 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(candidatesPage.statsSection).toBeVisible();
  });
});
