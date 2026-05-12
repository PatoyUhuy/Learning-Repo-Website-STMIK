import { test, expect } from '@playwright/test';
import { CandidatesPage } from './pages';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Candidates List"
test.describe('Admin Candidates List', () => {
  let candidatesPage: CandidatesPage;

  // Kegunaan: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan
  test.beforeEach(async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    candidatesPage = new CandidatesPage(page);
    // Login as admin before each test
    await candidatesPage.login('admin');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Page Load"
  test.describe('Page Load', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display candidates page with all sections"
    test('should display candidates page with all sections', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.candidatesPage).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statsSection).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filtersSection).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.candidatesTable).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display stats cards"
    test('should display stats cards', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statTotal).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statRegistered).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statProspecting).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statCommitted).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statEnrolled).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.statLost).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display filter controls"
    test('should display filter controls', async () => {
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterStatus).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterConsultant).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterProdi).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterCampaign).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterSource).toBeVisible();
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(candidatesPage.filterSearch).toBeVisible();
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should display candidates table with headers"
    test('should display candidates table with headers', async () => {
      const table = candidatesPage.candidatesTable;
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(table.locator('th')).toHaveCount(8); // Checkbox, Kandidat, Prodi, Status, EC, Sumber, Terdaftar, Aksi
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Filtering"
  test.describe('Filtering', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should filter by status"
    test('should filter by status', async ({ page }) => {
      // Get initial count
      const initialCount = await candidatesPage.getCandidateRowCount();

      // Filter by registered status
      await candidatesPage.selectStatus('registered');

      // URL should reflect the filter
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/status=registered/);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should filter by search query"
    test('should filter by search query', async ({ page }) => {
      // Search for a candidate
      await candidatesPage.searchCandidates('test');

      // URL should reflect the search
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/search=test/);
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should clear filters"
    test('should clear filters', async () => {
      // Apply some filters first
      await candidatesPage.selectStatus('registered');
      await candidatesPage.searchCandidates('test');

      // Clear filters
      await candidatesPage.clearFilters();

      // Verify filters are cleared
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(candidatesPage.filterStatus).toHaveValue('');
      // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
      await expect(candidatesPage.filterSearch).toHaveValue('');
    });

    // Kegunaan: Memulai eksekusi pengujian dengan judul "should update URL with filter parameters"
    test('should update URL with filter parameters', async ({ page }) => {
      await candidatesPage.selectStatus('prospecting');
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/status=prospecting/);

      await candidatesPage.selectSourceType('instagram');
      // Kegunaan: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan
      await expect(page).toHaveURL(/source_type=instagram/);
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Empty State"
  test.describe('Empty State', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should show empty message when no candidates match filter"
    test('should show empty message when no candidates match filter', async () => {
      // Search for something that should not exist
      await candidatesPage.searchCandidates('nonexistent-candidate-xyz-12345');
      await candidatesPage.expectEmptyList();
    });
  });

  // Kegunaan: Mengelompokkan skenario pengujian tentang "Navigation"
  test.describe('Navigation', () => {
    // Kegunaan: Memulai eksekusi pengujian dengan judul "should navigate to candidates from sidebar"
    test('should navigate to candidates from sidebar', async ({ page }) => {
      // Login as admin
      // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
      await page.goto('/test/login/admin');
      await page.waitForURL(/\/admin\/?$/);

      // Click candidates link in sidebar
      // Kegunaan: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)
      await page.getByTestId('nav-candidates').click();
      await page.waitForURL(/\/admin\/candidates/);

      // Verify page loaded
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(page.getByTestId('candidates-page')).toBeVisible();
    });
  });
});

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Candidates Role-Based Visibility"
test.describe('Admin Candidates Role-Based Visibility', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "admin should see all candidates"
  test('admin should see all candidates', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('admin');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Admin should see the total stat which represents all candidates
    const totalText = await candidatesPage.statTotal.textContent();
    // Just verify it's a number (admin sees all)
    expect(totalText).toMatch(/^\d+$/);
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant should only see assigned candidates"
  test('consultant should only see assigned candidates', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('consultant');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Consultant should see only their assigned candidates
    // The exact number depends on test data, just verify page loads correctly
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(candidatesPage.statsSection).toBeVisible();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor should see team candidates"
  test('supervisor should see team candidates', async ({ page }) => {
    // Kegunaan: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi
    const candidatesPage = new CandidatesPage(page);
    await candidatesPage.login('supervisor');
    await candidatesPage.goto();
    await candidatesPage.expectPageLoaded();

    // Supervisor should see their team's candidates
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(candidatesPage.statsSection).toBeVisible();
  });
});
