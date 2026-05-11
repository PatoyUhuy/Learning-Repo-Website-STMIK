/**
 * ============================================================================
 * FILE: pmb-crm-suite.spec.ts
 * ============================================================================
 * Tujuan: Ini adalah file test utama (Consolidated Test Suite) untuk sistem
 *         PMB CRM (Penerimaan Mahasiswa Baru). File ini menguji alur kerja
 *         (workflow) yang panjang dan terintegrasi, mulai dari pendaftaran
 *         sampai data masuk ke admin.
 * ============================================================================
 */

// Baris 13 sampai 14 digunakan untuk: Import modul dari Playwright untuk menjalankan test
import { test, expect, Browser } from '@playwright/test';
// Baris 15 digunakan untuk: Import Page Object Models (POM), yaitu kelas-kelas yang mewakili halaman web
import { RegistrationPage, LoginPage, PortalPage, CandidatesPage } from './pages';

// ============================================================================
// FUNGSI BANTUAN (Helpers)
// Fungsi-fungsi ini digunakan berulang kali di dalam test
// ============================================================================

// Fungsi pembuat email acak agar tiap test mendaftarkan user baru (mencegah error duplikasi)
function uniqueEmail(prefix = 'pmb'): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
}

// Fungsi pembuat nomor telepon acak yang diawali '08'
function uniquePhone(): string {
  return `08${Date.now().toString().slice(-10)}`;
}

// Fungsi utama untuk mendaftarkan kandidat baru dari tahap 1 sampai 4
async function registerCandidate(browser: Browser, opts: {
  email?: string; phone?: string; name?: string; password?: string;
} = {}): Promise<{ email: string; phone: string; name: string; password: string }> {
  // Jika tidak diberikan data spesifik, gunakan fungsi acak di atas
  const email = opts.email ?? uniqueEmail();
  const phone = opts.phone ?? uniquePhone();
  const name = opts.name ?? `PMB Test ${Date.now().toString().slice(-6)}`;
  const password = opts.password ?? 'testpassword123';

  // Buka tab browser baru dan masuk ke halaman registrasi
  const page = await browser.newPage();
  const reg = new RegistrationPage(page);
  await reg.goto();
  await reg.expectPageLoaded();
  
  // Isi Form Tahap 1 (Akun)
  await reg.fillStep1WithBoth(email, phone, password);
  await reg.expectStep2Visible();
  
  // Isi Form Tahap 2 (Biodata Diri)
  await reg.fillStep2(name, 'Jl. PMB Test No. 1', 'Jakarta', 'DKI Jakarta');
  await reg.expectStep3Visible();

  // Isi Form Tahap 3 (Program Studi & Sekolah)
  const prodiRadios = page.locator('[data-testid^="radio-prodi-"]');
  if ((await prodiRadios.count()) > 0) {
    await reg.inputHighSchool.fill('SMA PMB Test');
    await reg.selectGraduationYear.selectOption('2025');
    await prodiRadios.first().click(); // Pilih prodi pertama yang tersedia
    await reg.btnSubmitStep3.click();
    
    // Isi Form Tahap 4 (Sumber Info)
    await reg.expectStep4Visible();
    await reg.fillStep4('google');
  }
  
  // Tutup tab setelah selesai registrasi
  await page.close();
  return { email, phone, name, password };
}

// Fungsi untuk mendapatkan ID unik (UUID) kandidat dengan mencari di daftar Admin
async function getCandidateId(browser: Browser, email: string): Promise<string> {
  const page = await browser.newPage();
  const candidates = new CandidatesPage(page);
  
  // Login sebagai admin dan cari kandidat berdasarkan email
  await candidates.login('admin');
  await candidates.goto();
  await candidates.searchCandidates(email);
  
  // Ambil ID dari atribut elemen baris pertama
  const rows = await candidates.getAllCandidateRows();
  expect(rows.length).toBeGreaterThan(0);
  const testId = await rows[0].getAttribute('data-testid');
  const id = testId!.replace('candidate-row-', ''); // Hilangkan teks tambahan
  
  await page.close();
  return id;
}

// ============================================================================
// BAGIAN 1: Uji Hak Akses Berdasarkan Peran (Role-Based Access Control)
// Memastikan hanya user dengan jabatan yang tepat yang bisa mengakses halaman tertentu
// ============================================================================
test.describe('RBAC - Finance Pages Access Control', () => {
  
  // Consultant TIDAK BOLEH mengakses halaman Keuangan
  test('consultant cannot access finance billing pages', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/consultant'); // Login sbg consultant
    const response = await page.goto('/admin/finance/billings');
    expect(response?.status()).toBe(403); // 403 = Akses Ditolak (Forbidden)
    await page.close();
  });

  // Finance BOLEH mengakses halaman Keuangan
  test('finance user can access billing pages', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/finance');
    await page.goto('/admin/finance/billings');
    await expect(page.getByTestId('finance-billings-page')).toBeVisible(); // Halaman harus tampil
    await page.close();
  });

  // Admin BOLEH mengakses halaman Keuangan
  test('admin can access billing pages', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    await page.goto('/admin/finance/billings');
    await expect(page.getByTestId('finance-billings-page')).toBeVisible();
    await page.close();
  });
});

// Uji bahwa pengunjung yang belum login akan dilempar (redirect) ke halaman login
test.describe('RBAC - Auth Redirects', () => {
  test('unauthenticated user redirected from admin', async ({ page }) => {
    await page.context().clearCookies(); // Hapus sesi (logout)
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/); // Harus dilempar ke login admin
  });

  test('unauthenticated user redirected from portal', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/portal');
    await expect(page).toHaveURL(/\/login/); // Harus dilempar ke login portal
  });
});

// ============================================================================
// BAGIAN 2: Siklus Hidup Kandidat dari Awal Sampai Akhir (E2E)
// Berisi 8 langkah berurutan (serial)
// ============================================================================
test.describe('E2E - Candidate Lifecycle', () => {
  test.describe.configure({ mode: 'serial' }); // Semua test di sini HARUS berurutan

  // Variabel untuk menyimpan data sementara agar bisa diakses antar-langkah
  let candidateEmail: string;
  let candidatePhone: string;
  let candidateName: string;
  let candidatePassword: string;
  let candidateId: string;

  // Langkah 1: Registrasi kandidat dan pastikan bisa masuk portal
  test('Step 1: Register new candidate', async ({ browser }) => {
    const result = await registerCandidate(browser);
    candidateEmail = result.email;
    candidatePhone = result.phone;
    candidateName = result.name;
    candidatePassword = result.password;

    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(candidateEmail, candidatePassword);
    await login.expectRedirectToPortal();
    await page.close();
  });

  // Langkah 2: Pastikan data registrasi muncul di tabel Admin
  test('Step 2: Candidate appears in admin list', async ({ browser }) => {
    candidateId = await getCandidateId(browser, candidateEmail);
    expect(candidateId).toBeTruthy(); // ID tidak boleh kosong
  });

  // Langkah 3: Pastikan rincian data (nama & email) di Admin cocok dengan saat registrasi
  test('Step 3: Candidate detail shows correct data', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    await page.goto(`/admin/candidates/${candidateId}`);
    await expect(page.getByTestId('candidate-detail-page')).toBeVisible();
    await expect(page.getByTestId('candidate-name')).toContainText(candidateName);
    await expect(page.getByTestId('field-email')).toContainText(candidateEmail);
    await page.close();
  });

  // Langkah 4: Simulasikan Konsultan menambahkan catatan (follow up) di profil kandidat
  test('Step 4: Consultant logs interaction', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/consultant');
    await page.goto(`/admin/candidates/${candidateId}/interaction`);

    // Pilih mode WA dan isi teks catatan
    await page.locator('label:has(input[name="channel"][value="whatsapp"])').click();
    await page.locator('label:has(input[name="category"])').first().click();
    const remarks = `Lifecycle followup ${Date.now()}`;
    await page.locator('textarea[name="remarks"]').fill(remarks);
    await page.locator('button[value="save"]').click();

    // Pastikan catatan tersimpan dan muncul di timeline (riwayat)
    await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+$/);
    await expect(page.locator(`text=${remarks.substring(0, 20)}`)).toBeVisible();
    await page.close();
  });

  // Langkah 5: Pastikan portal mahasiswa menampilkan status "Dalam Proses" dan nama konsultan
  test('Step 5: Portal shows status and consultant', async ({ browser }) => {
    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(candidateEmail, candidatePassword);
    await login.expectRedirectToPortal();

    const portal = new PortalPage(page);
    await portal.expectPageLoaded();
    await portal.expectWelcomeMessage(candidateName);
    await portal.expectStatus('Dalam Proses');
    await expect(portal.consultantSection).toBeVisible();
    await page.close();
  });

  // Langkah 6: Pastikan halaman unggah dokumen di portal tidak rusak/error
  test('Step 6: Portal documents page loads', async ({ browser }) => {
    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(candidateEmail, candidatePassword);
    await login.expectRedirectToPortal();
    await page.goto('/portal/documents');
    await expect(page.getByRole('heading', { name: 'KTP' })).toBeVisible();
    await page.close();
  });

  // Langkah 7: Pastikan halaman pembayaran di portal tidak rusak/error
  test('Step 7: Portal payments page loads', async ({ browser }) => {
    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(candidateEmail, candidatePassword);
    await login.expectRedirectToPortal();
    await page.goto('/portal/payments');
    await expect(page.getByRole('heading', { name: 'Pembayaran', exact: true })).toBeVisible();
    await page.close();
  });

  // Langkah 8: Simulasikan Admin membatalkan kandidat (Mark as Lost)
  test('Step 8: Mark candidate as lost', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    await page.goto(`/admin/candidates/${candidateId}`);
    await expect(page.getByTestId('candidate-detail-page')).toBeVisible();

    const btnLost = page.getByTestId('btn-mark-lost');
    if (await btnLost.isVisible()) {
      await btnLost.click();
      await expect(page.getByTestId('modal-lost')).toBeVisible();
      
      // Pilih alasan batal dan simpan
      const reasonSelect = page.getByTestId('select-lost-reason');
      const options = await reasonSelect.locator('option').allTextContents();
      if (options.length > 1) {
        await reasonSelect.selectOption({ index: 1 });
        await page.getByTestId('btn-confirm-lost').click();
        
        // Pastikan status di bagian atas berubah menjadi "Tidak Lanjut"
        await page.waitForURL(/\/admin\/candidates\/[a-f0-9-]+/);
        await expect(page.getByTestId('candidate-header')).toContainText('Tidak Lanjut');
      }
    }
    await page.close();
  });
});

// ============================================================================
// BAGIAN 3: Tes Integrasi Lintas Fitur
// ============================================================================
test.describe('Cross-Module Integration', () => {
  
  // Tes: Setiap ada pendaftar baru, angka Total Kandidat di Admin harus naik 1
  test('new registration increases candidate count', async ({ browser }) => {
    const page1 = await browser.newPage();
    const c1 = new CandidatesPage(page1);
    await c1.login('admin');
    await c1.goto();
    await c1.expectPageLoaded();
    const initialTotal = parseInt((await c1.statTotal.textContent()) || '0');
    await page1.close();

    await registerCandidate(browser);

    const page2 = await browser.newPage();
    const c2 = new CandidatesPage(page2);
    await c2.login('admin');
    await c2.goto();
    await c2.expectPageLoaded();
    const newTotal = parseInt((await c2.statTotal.textContent()) || '0');
    
    // Pastikan angka yang baru lebih besar dari sebelumnya
    expect(newTotal).toBeGreaterThan(initialTotal);
    await page2.close();
  });

  // Tes: Pendaftar baru otomatis dibagikan (di-assign) ke seorang konsultan
  test('candidate auto-assigned to consultant', async ({ browser }) => {
    const { email } = await registerCandidate(browser);
    const id = await getCandidateId(browser, email);

    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    await page.goto(`/admin/candidates/${id}`);
    
    // Kolom konsultan tidak boleh bertuliskan "Belum ditugaskan"
    await expect(page.getByTestId('candidate-detail-page')).toBeVisible();
    await expect(page.getByTestId('field-consultant')).not.toContainText('Belum ditugaskan');
    await page.close();
  });

  // Tes: Memastikan semua kartu statistik di Dashboard menampilkan angka yang valid
  test('dashboard stats are numeric', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    await page.goto('/admin');
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();

    const values = page.getByTestId('stats-cards').locator('.text-3xl.font-bold');
    const count = await values.count();
    
    // Looping semua kartu statistik
    for (let i = 0; i < count; i++) {
      const text = await values.nth(i).textContent();
      expect(text?.trim()).toMatch(/^\d+$/); // Harus berupa digit/angka
    }
    await page.close();
  });

  // Tes: Memastikan grafik Funnel menampilkan semua 4 tahapan
  test('funnel overview shows all stages', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    await page.goto('/admin');
    const funnel = page.getByTestId('funnel-section');
    await expect(funnel.getByText('Registered')).toBeVisible();
    await expect(funnel.getByText('Prospecting')).toBeVisible();
    await expect(funnel.getByText('Committed')).toBeVisible();
    await expect(funnel.getByText('Enrolled')).toBeVisible();
    await page.close();
  });
});

// ============================================================================
// BAGIAN 4: Uji Keamanan (Security & Edge Cases)
// ============================================================================
test.describe('Security - Invalid Input', () => {
  
  // Tes: Mencari ID dengan format benar tapi tidak ada di database, harus error 404 (Not Found)
  test('invalid candidate UUID returns 404', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    const r = await page.goto('/admin/candidates/00000000-0000-0000-0000-000000000000');
    expect(r?.status()).toBe(404);
    await page.close();
  });

  // Tes: Mencari ID dengan format huruf sembarangan (tidak valid), harus ditolak sistem
  test('malformed UUID returns error', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    const r = await page.goto('/admin/candidates/invalid-id');
    expect([404, 500]).toContain(r?.status());
    await page.close();
  });

  // Tes: URL /health untuk monitoring server harus bisa diakses bebas tanpa perlu login
  test('health endpoint accessible without auth', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  // Tes Keamanan CSRF: Permintaan POST (simpan data) dari website lain/hacker
  // harus otomatis diblokir dengan kode 403 (Forbidden)
  test('cross-origin POST blocked', async ({ request }) => {
    const response = await request.post('/test/submit', {
      headers: { 'Origin': 'https://evil-site.com', 'Sec-Fetch-Site': 'cross-site' },
      data: { test: 'value' },
    });
    expect(response.status()).toBe(403);
  });
});

// Tes Keamanan Manajemen Sesi (Session)
test.describe('Security - Sessions', () => {
  // Tes: Login sukses membuat cookie sesi yang memperbolehkan akses halaman dalam
  test('login creates valid session', async ({ browser }) => {
    const { email, password } = await registerCandidate(browser);
    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    await login.expectRedirectToPortal();
    await page.goto('/portal/documents');
    await expect(page).toHaveURL('/portal/documents'); // Tidak ditendang ke /login
    await page.close();
  });

  // Tes: Mengklik Logout akan menghapus sesi, sehingga halaman dalam tidak bisa diakses lagi
  test('logout invalidates session', async ({ browser }) => {
    const { email, password } = await registerCandidate(browser);
    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    await login.expectRedirectToPortal();

    const portal = new PortalPage(page);
    await portal.logout();
    await expect(page).toHaveURL('/login'); // Berhasil kembali ke halaman login
    
    // Coba bandel, paksa ketik URL portal setelah logout
    await page.goto('/portal');
    await expect(page).toHaveURL('/login'); // Harus dicegah dan tetap di halaman login
    await page.close();
  });
});

// ============================================================================
// BAGIAN 5: Uji Cepat (Smoke Tests) Halaman Pengaturan Admin
// Memastikan semua halaman setting bisa dibuka dan tidak "layar putih" (crash)
// ============================================================================
test.describe('Admin Settings - Smoke Tests', () => {
  
  // Sebelum setiap tes kecil di bawah ini berjalan, selalu login admin dulu
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Daftar semua menu pengaturan dan ID elemen halamannya
  const settingsPages = [
    { path: '/admin/settings/programs', testId: 'settings-programs-page', name: 'Programs' },
    { path: '/admin/settings/users', testId: 'settings-users-page', name: 'Users' },
    { path: '/admin/settings/campaigns', testId: 'settings-campaigns-page', name: 'Campaigns' },
    { path: '/admin/settings/referrers', testId: 'settings-referrers-page', name: 'Referrers' },
    { path: '/admin/settings/fees', testId: 'settings-fees-page', name: 'Fees' },
    { path: '/admin/settings/document-types', testId: 'settings-documents-page', name: 'Document Types' },
    { path: '/admin/settings/lost-reasons', testId: 'settings-lost-reasons-page', name: 'Lost Reasons' },
    { path: '/admin/settings/assignment', testId: 'settings-assignment-page', name: 'Assignment' },
    { path: '/admin/settings/rewards', testId: 'settings-rewards-page', name: 'Rewards' },
    { path: '/admin/settings/categories', testId: 'settings-categories-page', name: 'Categories' },
  ];

  // Melakukan tes otomatis untuk masing-masing halaman di atas (Looping)
  for (const sp of settingsPages) {
    test(`${sp.name} settings page loads`, async ({ page }) => {
      await page.goto(sp.path);
      await expect(page.getByTestId(sp.testId)).toBeVisible(); // Pastikan ada konten
    });
  }
});

// ============================================================================
// BAGIAN 6: Uji Cepat (Smoke Tests) Laporan dan Komisi
// ============================================================================
test.describe('Reports - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/login/admin');
    await page.waitForURL(/\/admin\/?$/);
  });

  // Tes: Halaman Laporan Funnel bisa dibuka
  test('funnel report loads', async ({ page }) => {
    await page.goto('/admin/reports/funnel');
    await expect(page.getByRole('heading', { name: 'Laporan Funnel', level: 2 })).toBeVisible();
  });

  // Tes: Halaman Laporan Marketing Campaign bisa dibuka
  test('campaign report loads', async ({ page }) => {
    await page.goto('/admin/reports/campaigns');
    await expect(page.getByRole('heading', { name: 'Laporan ROI Kampanye', level: 2 })).toBeVisible();
  });

  // Tes: Halaman Laporan Kinerja Konsultan bisa dibuka
  test('consultant report loads', async ({ page }) => {
    await page.goto('/admin/reports/consultants');
    await expect(page.getByTestId('consultant-report-page')).toBeVisible();
  });

  // Tes: Halaman Laporan Top Referrer bisa dibuka
  test('referrer report loads', async ({ page }) => {
    await page.goto('/admin/reports/referrers');
    await expect(page.getByRole('heading', { name: 'Leaderboard Referrer', level: 2 })).toBeVisible();
  });
});

test.describe('Commissions - Smoke Tests', () => {
  // Tes: Halaman Komisi bisa dibuka oleh Admin
  test('admin can access commissions', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    await page.goto('/admin/commissions');
    await expect(page.getByTestId('commissions-page')).toBeVisible();
    await page.close();
  });

  // Tes: Fitur Download Data (Export ke CSV) mengembalikan file berformat Excel/CSV
  test('CSV export returns valid response', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/test/login/admin');
    
    // Panggil API secara langsung (tanpa UI)
    const response = await page.request.get('/admin/commissions/export?status=approved');
    
    // Pastikan berhasil dan tipe filenya text/csv
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/csv');
    
    await page.close();
  });
});

