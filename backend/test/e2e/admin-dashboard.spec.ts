import { test, expect } from '@playwright/test';

// Baris 4 digunakan untuk: Mengelompokkan skenario pengujian tentang "Admin Dashboard"
test.describe('Admin Dashboard', () => {
  // Baris 6 digunakan untuk: Memulai eksekusi pengujian dengan judul "dashboard loads with all sections visible"
  test('dashboard loads with all sections visible', async ({ browser }) => {
    // Baris 8 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 10 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Baris 12 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Baris 15 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
    // Baris 17 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stats-cards')).toBeVisible();
    // Baris 19 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('overdue-section')).toBeVisible();
    // Baris 21 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('today-tasks-section')).toBeVisible();
    // Baris 23 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('funnel-section')).toBeVisible();
    // Baris 25 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('recent-candidates-section')).toBeVisible();

    // Baris 28 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 32 digunakan untuk: Memulai eksekusi pengujian dengan judul "stats cards show numeric values"
  test('stats cards show numeric values', async ({ browser }) => {
    // Baris 34 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 36 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Baris 38 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const statsCards = page.getByTestId('stats-cards');

    // Verify stat labels are present
    // Baris 44 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsCards.getByText('Total Kandidat')).toBeVisible();
    // Baris 46 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsCards.getByText('Prospecting')).toBeVisible();
    // Baris 48 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsCards.getByText('Committed')).toBeVisible();
    // Baris 50 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsCards.getByText('Enrolled')).toBeVisible();

    // Verify each card has a bold numeric value (text-3xl font-bold)
    const boldValues = statsCards.locator('.text-3xl.font-bold');
    const count = await boldValues.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      const text = await boldValues.nth(i).textContent();
      expect(text).toBeTruthy();
      expect(text!.trim()).toMatch(/^\d+$/);
    }

    // Baris 64 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 68 digunakan untuk: Memulai eksekusi pengujian dengan judul "overdue section renders correctly"
  test('overdue section renders correctly', async ({ browser }) => {
    // Baris 70 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 72 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Baris 74 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const overdueSection = page.getByTestId('overdue-section');
    // Baris 78 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(overdueSection).toBeVisible();

    // Check heading
    // Baris 82 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(overdueSection.getByRole('heading', { name: 'Follow-up Terlambat' })).toBeVisible();

    // Check badge shows candidate count
    const badge = overdueSection.locator('.bg-red-100');
    // Baris 87 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(badge).toBeVisible();
    // Baris 89 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(badge).toContainText('kandidat');

    // If there are overdue candidates, verify items have link to detail page
    const overdueItems = overdueSection.locator('.bg-red-50');
    const itemCount = await overdueItems.count();
    if (itemCount > 0) {
      for (let i = 0; i < itemCount; i++) {
        const item = overdueItems.nth(i);
        // Each item should have a "Lihat" link pointing to candidate detail
        const link = item.getByRole('link', { name: 'Lihat' });
        // Baris 100 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(link).toBeVisible();
        // Baris 102 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(link).toHaveAttribute('href', /\/admin\/candidates\//);
      }
    } else {
      // Empty state message
      // Baris 107 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(overdueSection.getByText('Tidak ada follow-up terlambat')).toBeVisible();
    }

    // Baris 111 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 115 digunakan untuk: Memulai eksekusi pengujian dengan judul "today tasks section renders correctly"
  test('today tasks section renders correctly', async ({ browser }) => {
    // Baris 117 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 119 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Baris 121 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const todaySection = page.getByTestId('today-tasks-section');
    // Baris 125 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(todaySection).toBeVisible();

    // Check heading
    // Baris 129 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(todaySection.getByRole('heading', { name: 'Tugas Hari Ini' })).toBeVisible();

    // Check badge shows follow-up count
    const badge = todaySection.locator('.bg-blue-100');
    // Baris 134 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(badge).toBeVisible();
    // Baris 136 digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(badge).toContainText('follow-up');

    // If there are tasks, verify items have link to detail page
    const taskItems = todaySection.locator('.bg-gray-50.rounded-lg');
    const itemCount = await taskItems.count();
    if (itemCount > 0) {
      for (let i = 0; i < itemCount; i++) {
        const item = taskItems.nth(i);
        // Each item should have a "Follow-up" link pointing to candidate detail
        const link = item.getByRole('link', { name: 'Follow-up' });
        // Baris 147 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(link).toBeVisible();
        // Baris 149 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(link).toHaveAttribute('href', /\/admin\/candidates\//);
      }
    } else {
      // Empty state message
      // Baris 154 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(todaySection.getByText('Tidak ada tugas hari ini')).toBeVisible();
    }

    // Baris 158 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 162 digunakan untuk: Memulai eksekusi pengujian dengan judul "funnel overview shows stages with labels"
  test('funnel overview shows stages with labels', async ({ browser }) => {
    // Baris 164 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 166 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Baris 168 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const funnelSection = page.getByTestId('funnel-section');
    // Baris 172 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection).toBeVisible();

    // Check heading
    // Baris 176 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Funnel Overview')).toBeVisible();

    // Check all 4 funnel stage labels
    // Baris 180 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Registered')).toBeVisible();
    // Baris 182 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Prospecting')).toBeVisible();
    // Baris 184 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Committed')).toBeVisible();
    // Baris 186 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Enrolled')).toBeVisible();

    // Check that each stage has a numeric value (text-2xl font-bold)
    const stageValues = funnelSection.locator('.text-2xl.font-bold');
    const count = await stageValues.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      const text = await stageValues.nth(i).textContent();
      expect(text).toBeTruthy();
      expect(text!.trim()).toMatch(/^\d+$/);
    }

    // Baris 200 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 204 digunakan untuk: Memulai eksekusi pengujian dengan judul "recent candidates table shows headers and data"
  test('recent candidates table shows headers and data', async ({ browser }) => {
    // Baris 206 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 208 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Baris 210 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const recentSection = page.getByTestId('recent-candidates-section');
    // Baris 214 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection).toBeVisible();

    // Check section heading
    // Baris 218 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByText('Kandidat Terbaru')).toBeVisible();

    // Check "Lihat Semua" link
    const viewAllLink = recentSection.getByRole('link', { name: /Lihat Semua/ });
    // Baris 223 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(viewAllLink).toBeVisible();
    // Baris 225 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(viewAllLink).toHaveAttribute('href', '/admin/candidates');

    // Check table headers
    // Baris 229 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /nama/i })).toBeVisible();
    // Baris 231 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /prodi/i })).toBeVisible();
    // Baris 233 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /status/i })).toBeVisible();
    // Baris 235 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /ec/i })).toBeVisible();
    // Baris 237 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /tanggal/i })).toBeVisible();

    // If there are candidate rows, verify each has a link to detail page
    const dataRows = recentSection.locator('tbody tr');
    const rowCount = await dataRows.count();
    if (rowCount > 0) {
      const firstRowLink = dataRows.first().getByRole('link');
      const firstRowLinkCount = await firstRowLink.count();
      if (firstRowLinkCount > 0) {
        // Baris 247 digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(firstRowLink.first()).toHaveAttribute('href', /\/admin\/candidates\//);
      }
    }

    // Baris 252 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 256 digunakan untuk: Memulai eksekusi pengujian dengan judul "consultant accessing /admin sees appropriate dashboard"
  test('consultant accessing /admin sees appropriate dashboard', async ({ browser }) => {
    // Baris 258 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 260 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    // Baris 262 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Consultant should see the admin dashboard (their own view)
    // Baris 266 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
    // Baris 268 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stats-cards')).toBeVisible();

    // Baris 271 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Baris 275 digunakan untuk: Memulai eksekusi pengujian dengan judul "supervisor accessing /admin sees admin dashboard"
  test('supervisor accessing /admin sees admin dashboard', async ({ browser }) => {
    // Baris 277 digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Baris 279 digunakan untuk: Membuka browser dan menavigasi ke halaman "/test/login/supervisor"
    await page.goto('/test/login/supervisor');
    // Baris 281 digunakan untuk: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Supervisor should see the admin dashboard
    // Baris 285 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
    // Baris 287 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stats-cards')).toBeVisible();
    // Baris 289 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('funnel-section')).toBeVisible();
    // Baris 291 digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('recent-candidates-section')).toBeVisible();

    // Baris 294 digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });
});
