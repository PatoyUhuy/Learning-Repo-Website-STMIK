import { test, expect } from '@playwright/test';

// Kegunaan: Mengelompokkan skenario pengujian tentang "Admin Dashboard"
test.describe('Admin Dashboard', () => {
  // Kegunaan: Memulai eksekusi pengujian dengan judul "dashboard loads with all sections visible"
  test('dashboard loads with all sections visible', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stats-cards')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('overdue-section')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('today-tasks-section')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('funnel-section')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('recent-candidates-section')).toBeVisible();

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "stats cards show numeric values"
  test('stats cards show numeric values', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const statsCards = page.getByTestId('stats-cards');

    // Verify stat labels are present
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsCards.getByText('Total Kandidat')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsCards.getByText('Prospecting')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(statsCards.getByText('Committed')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
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

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "overdue section renders correctly"
  test('overdue section renders correctly', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const overdueSection = page.getByTestId('overdue-section');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(overdueSection).toBeVisible();

    // Check heading
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(overdueSection.getByRole('heading', { name: 'Follow-up Terlambat' })).toBeVisible();

    // Check badge shows candidate count
    const badge = overdueSection.locator('.bg-red-100');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(badge).toBeVisible();
    // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(badge).toContainText('kandidat');

    // If there are overdue candidates, verify items have link to detail page
    const overdueItems = overdueSection.locator('.bg-red-50');
    const itemCount = await overdueItems.count();
    if (itemCount > 0) {
      for (let i = 0; i < itemCount; i++) {
        const item = overdueItems.nth(i);
        // Each item should have a "Lihat" link pointing to candidate detail
        const link = item.getByRole('link', { name: 'Lihat' });
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(link).toBeVisible();
        // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(link).toHaveAttribute('href', /\/admin\/candidates\//);
      }
    } else {
      // Empty state message
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(overdueSection.getByText('Tidak ada follow-up terlambat')).toBeVisible();
    }

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "today tasks section renders correctly"
  test('today tasks section renders correctly', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const todaySection = page.getByTestId('today-tasks-section');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(todaySection).toBeVisible();

    // Check heading
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(todaySection.getByRole('heading', { name: 'Tugas Hari Ini' })).toBeVisible();

    // Check badge shows follow-up count
    const badge = todaySection.locator('.bg-blue-100');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(badge).toBeVisible();
    // Kegunaan: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut
    await expect(badge).toContainText('follow-up');

    // If there are tasks, verify items have link to detail page
    const taskItems = todaySection.locator('.bg-gray-50.rounded-lg');
    const itemCount = await taskItems.count();
    if (itemCount > 0) {
      for (let i = 0; i < itemCount; i++) {
        const item = taskItems.nth(i);
        // Each item should have a "Follow-up" link pointing to candidate detail
        const link = item.getByRole('link', { name: 'Follow-up' });
        // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
        await expect(link).toBeVisible();
        // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(link).toHaveAttribute('href', /\/admin\/candidates\//);
      }
    } else {
      // Empty state message
      // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
      await expect(todaySection.getByText('Tidak ada tugas hari ini')).toBeVisible();
    }

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "funnel overview shows stages with labels"
  test('funnel overview shows stages with labels', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const funnelSection = page.getByTestId('funnel-section');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection).toBeVisible();

    // Check heading
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Funnel Overview')).toBeVisible();

    // Check all 4 funnel stage labels
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Registered')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Prospecting')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(funnelSection.getByText('Committed')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
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

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "recent candidates table shows headers and data"
  test('recent candidates table shows headers and data', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/admin"
    await page.goto('/test/login/admin');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    const recentSection = page.getByTestId('recent-candidates-section');
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection).toBeVisible();

    // Check section heading
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByText('Kandidat Terbaru')).toBeVisible();

    // Check "Lihat Semua" link
    const viewAllLink = recentSection.getByRole('link', { name: /Lihat Semua/ });
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(viewAllLink).toBeVisible();
    // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
    await expect(viewAllLink).toHaveAttribute('href', '/admin/candidates');

    // Check table headers
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /nama/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /prodi/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /status/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /ec/i })).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(recentSection.getByRole('columnheader', { name: /tanggal/i })).toBeVisible();

    // If there are candidate rows, verify each has a link to detail page
    const dataRows = recentSection.locator('tbody tr');
    const rowCount = await dataRows.count();
    if (rowCount > 0) {
      const firstRowLink = dataRows.first().getByRole('link');
      const firstRowLinkCount = await firstRowLink.count();
      if (firstRowLinkCount > 0) {
        // Kegunaan: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi
        await expect(firstRowLink.first()).toHaveAttribute('href', /\/admin\/candidates\//);
      }
    }

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "consultant accessing /admin sees appropriate dashboard"
  test('consultant accessing /admin sees appropriate dashboard', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/consultant"
    await page.goto('/test/login/consultant');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Consultant should see the admin dashboard (their own view)
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stats-cards')).toBeVisible();

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });

  // Kegunaan: Memulai eksekusi pengujian dengan judul "supervisor accessing /admin sees admin dashboard"
  test('supervisor accessing /admin sees admin dashboard', async ({ browser }) => {
    // Kegunaan: Membuka tab browser baru yang masih bersih (kosong)
    const page = await browser.newPage();
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/test/login/supervisor"
    await page.goto('/test/login/supervisor');
    // Kegunaan: Membuka browser dan menavigasi ke halaman "/admin"
    await page.goto('/admin');

    // Supervisor should see the admin dashboard
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('admin-dashboard')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('stats-cards')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('funnel-section')).toBeVisible();
    // Kegunaan: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna
    await expect(page.getByTestId('recent-candidates-section')).toBeVisible();

    // Kegunaan: Menutup tab browser setelah pengujian selesai agar tidak memakan memori
    await page.close();
  });
});
