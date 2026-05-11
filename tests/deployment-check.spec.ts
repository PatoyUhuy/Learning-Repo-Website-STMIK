/**
 * ============================================================================
 * FILE: deployment-check.spec.ts
 * ============================================================================
 * Tujuan: Mengecek apakah website STMIK Tazkia yang sudah di-deploy (production)
 *         berfungsi dengan baik. Test ini BUKAN untuk server lokal, melainkan
 *         untuk website live di https://stmik.tazkia.ac.id
 *
 * Cakupan:
 *   - Homepage Indonesia & English
 *   - Navigasi & Footer
 *   - Responsive Design (mobile, tablet, desktop)
 *   - SEO (meta tags, sitemap, robots.txt)
 *   - Performance (waktu loading)
 *   - Accessibility (heading hierarchy, alt text, lang attribute)
 *
 * Cara menjalankan:
 *   npx playwright test tests/deployment-check.spec.ts
 * ============================================================================
 */

// Baris 25 sampai 26 digunakan untuk: Import fungsi test dan expect dari Playwright.
// - `test` digunakan untuk mendefinisikan test case
// - `expect` digunakan untuk membuat assertion (pernyataan yang harus benar)
import { test, expect } from '@playwright/test';

// Baris 28 digunakan untuk: URL website production yang akan di-test
const BASE_URL = 'https://stmik.tazkia.ac.id';

// =============================================================================
// BAGIAN 1: Test Homepage Bahasa Indonesia
// Mengecek elemen-elemen utama homepage versi Indonesia
// =============================================================================
test.describe('Deployed Website Check', () => {
  test.describe('Indonesian Homepage', () => {

    // Test: Memastikan homepage bisa dimuat tanpa error (HTTP 200 = OK)
    test('should load homepage without errors', async ({ page }) => {
      const response = await page.goto(BASE_URL);
      expect(response?.status()).toBe(200);
    });

    // Test: Memastikan nama situs, logo, dan heading H1 tampil di halaman
    // - Cek title halaman mengandung "STMIK Tazkia"
    // - Cek gambar logo dengan alt text "STMIK" terlihat
    // - Cek heading <h1> yang berisi "STMIK Tazkia" terlihat
    test('should display site name and logo', async ({ page }) => {
      await page.goto(BASE_URL);

      // Cek judul halaman browser (tab title)
      await expect(page).toHaveTitle(/STMIK Tazkia/);

      // Cek logo gambar terlihat
      const logo = page.locator('img[alt*="STMIK"]').first();
      await expect(logo).toBeVisible();

      // Cek heading utama H1
      const heading = page.locator('h1:has-text("STMIK Tazkia")');
      await expect(heading).toBeVisible();
    });

    // Test: Memastikan tidak ada error JavaScript di console browser
    // Cara kerja: Mendengarkan event 'console' di browser, jika ada pesan
    // bertipe 'error', dicatat. Setelah halaman dimuat, array errors harus kosong.
    test('should have no console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle'); // Tunggu semua request selesai

      expect(errors).toEqual([]); // Tidak boleh ada error
    });

    // Test: Memastikan semua gambar bisa dimuat (tidak ada yang 404/Not Found)
    // Cara kerja: Memantau semua HTTP response. Jika ada response untuk gambar
    // yang statusnya 404, dicatat. Setelah halaman dimuat, array harus kosong.
    test('should load all images without 404', async ({ page }) => {
      const failed404s: string[] = [];

      // Listener: Pantau setiap response HTTP
      page.on('response', response => {
        if (response.status() === 404 && response.request().resourceType() === 'image') {
          failed404s.push(response.url());
        }
      });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      if (failed404s.length > 0) {
        console.log('Failed images:', failed404s);
      }
      expect(failed404s).toEqual([]); // Tidak boleh ada gambar 404
    });

    // Test: Memastikan semua file CSS bisa dimuat tanpa error
    // Sama seperti test gambar di atas, tapi untuk file stylesheet (CSS)
    test('should load all stylesheets without errors', async ({ page }) => {
      const failedCSS: string[] = [];

      page.on('response', response => {
        if (response.status() !== 200 && response.request().resourceType() === 'stylesheet') {
          failedCSS.push(`${response.url()} - ${response.status()}`);
        }
      });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      if (failedCSS.length > 0) {
        console.log('Failed CSS:', failedCSS);
      }
      expect(failedCSS).toEqual([]);
    });

    // Test: Memastikan ada menu navigasi di halaman
    // Menghitung jumlah link di dalam <nav> atau <header>, minimal harus ada 1
    test('should have navigation menu', async ({ page }) => {
      await page.goto(BASE_URL);

      // Cari link navigasi
      const homeLink = page.locator('a:has-text("Beranda"), nav a[href*="index"]').first();
      const programsLink = page.locator('a:has-text("Program")').first();

      // Minimal harus ada beberapa link navigasi
      const navLinks = await page.locator('nav a, header a').count();
      expect(navLinks).toBeGreaterThan(0);
    });

    // Test: Memastikan footer terlihat dan mengandung info kontak
    // Mengecek apakah ada nomor telepon (+62) atau alamat (bogor/dramaga)
    test('should have footer with contact info', async ({ page }) => {
      await page.goto(BASE_URL);

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Cek apakah ada info telepon atau alamat di footer
      const hasPhone = await footer.locator('text=/\\+62|phone|telepon/i').count() > 0;
      const hasAddress = await footer.locator('text=/bogor|dramaga|alamat|address/i').count() > 0;

      expect(hasPhone || hasAddress).toBeTruthy();
    });

    // Test: Memastikan tombol CTA (Call-to-Action) "Daftar Sekarang" ada dan berfungsi
    // Tombol harus terlihat dan memiliki atribut href (link tujuan)
    test('should have working CTA buttons', async ({ page }) => {
      await page.goto(BASE_URL);

      const ctaButton = page.locator('a:has-text("Daftar Sekarang")').first();
      await expect(ctaButton).toBeVisible();

      // Pastikan tombol punya link tujuan
      const href = await ctaButton.getAttribute('href');
      expect(href).toBeTruthy();
    });

    // Test: Memastikan section "Keunggulan" tampil dengan beberapa item feature
    // Heading H2 "Keunggulan" harus terlihat, dan minimal ada 3 sub-heading H3
    test('should display features section', async ({ page }) => {
      await page.goto(BASE_URL);

      const featuresHeading = page.locator('h2:has-text("Keunggulan")');
      await expect(featuresHeading).toBeVisible();

      // Harus ada lebih dari 2 item feature
      const featureCount = await page.locator('h3').count();
      expect(featureCount).toBeGreaterThan(2);
    });

    // Test: Memastikan section "Program Studi" tampil dengan nama-nama prodi
    // Harus ada "Sistem Informasi" dan "Teknik Informatika"
    test('should display programs section', async ({ page }) => {
      await page.goto(BASE_URL);

      const programsHeading = page.locator('h2:has-text("Program Studi")');
      await expect(programsHeading).toBeVisible();

      // Cek nama program studi spesifik
      const systemsInfo = page.locator('text=/Sistem Informasi/i');
      const computerEng = page.locator('text=/Teknik Informatika/i');

      await expect(systemsInfo).toBeVisible();
      await expect(computerEng).toBeVisible();
    });
  });

  // =============================================================================
  // BAGIAN 2: Test Homepage Bahasa Inggris
  // Mengecek versi English dari website (/en/)
  // =============================================================================
  test.describe('English Homepage', () => {

    // Test: Memastikan halaman English bisa dimuat (HTTP 200)
    test('should load English homepage', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/en/`);
      expect(response?.status()).toBe(200);
    });

    // Test: Memastikan konten ditampilkan dalam bahasa Inggris
    // Mencari kata-kata English seperti "Learn more", "Apply now", dll.
    test('should display content in English', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/`);

      const hasEnglishContent = await page.locator('text=/Learn more|Apply now|Information Systems|Computer Engineering/i').count() > 0;
      expect(hasEnglishContent).toBeGreaterThan(0);
    });

    // Test: Memastikan semua gambar di halaman EN bisa dimuat (tidak 404)
    test('should load logo on English page', async ({ page }) => {
      const failed404s: string[] = [];

      page.on('response', response => {
        if (response.status() === 404 && response.request().resourceType() === 'image') {
          failed404s.push(response.url());
        }
      });

      await page.goto(`${BASE_URL}/en/`);
      await page.waitForLoadState('networkidle');

      if (failed404s.length > 0) {
        console.log('Failed images on EN page:', failed404s);
      }
      expect(failed404s).toEqual([]);
    });
  });

  // =============================================================================
  // BAGIAN 3: Test Pergantian Bahasa
  // Memastikan ada tombol/link untuk berganti bahasa
  // =============================================================================
  test.describe('Language Switching', () => {

    // Test: Memastikan ada language switcher (link ke /en atau tombol "EN")
    test('should have language switcher', async ({ page }) => {
      await page.goto(BASE_URL);

      const langSwitcher = await page.locator('a[href*="/en"], button:has-text("EN"), a:has-text("English")').count();
      expect(langSwitcher).toBeGreaterThan(0);
    });
  });

  // =============================================================================
  // BAGIAN 4: Test Responsive Design
  // Mengecek tampilan di berbagai ukuran layar (mobile, tablet, desktop)
  // =============================================================================
  test.describe('Responsive Design', () => {

    // Test: Tampilan di layar mobile (iPhone SE - 375x667)
    // Logo dan heading harus tetap terlihat
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);

      const logo = page.locator('img[alt*="STMIK"]').first();
      await expect(logo).toBeVisible();

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    });

    // Test: Tampilan di layar tablet (iPad - 768x1024)
    test('should be tablet responsive', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    });

    // Test: Tampilan di layar desktop (Full HD - 1920x1080)
    test('should be desktop responsive', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
    });
  });

  // =============================================================================
  // BAGIAN 5: Test SEO (Search Engine Optimization)
  // Memastikan website bisa diindeks dengan baik oleh Google
  // =============================================================================
  test.describe('SEO and Meta Tags', () => {

    // Test: Memastikan ada meta description dan Open Graph tag
    // - meta description: deskripsi halaman yang muncul di hasil pencarian Google
    // - og:title: judul yang muncul saat link di-share di media sosial
    test('should have proper meta tags', async ({ page }) => {
      await page.goto(BASE_URL);

      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);

      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveCount(1);
    });

    // Test: Memastikan file sitemap XML tersedia
    // Sitemap memberitahu search engine tentang struktur halaman website
    test('should have sitemap', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/sitemap-index.xml`);
      expect(response?.status()).toBe(200);

      const content = await page.content();
      expect(content).toContain('<?xml');
      expect(content).toContain('sitemap');
    });

    // Test: Memastikan file robots.txt tersedia
    // robots.txt memberitahu search engine halaman mana yang boleh/tidak boleh di-crawl
    test('should have robots.txt', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/robots.txt`);
      expect(response?.status()).toBe(200);
    });
  });

  // =============================================================================
  // BAGIAN 6: Test Performance
  // Mengukur kecepatan loading halaman
  // =============================================================================
  test.describe('Performance', () => {

    // Test: Halaman harus bisa dimuat dalam waktu kurang dari 10 detik
    // Cara kerja: Catat waktu sebelum dan sesudah halaman dimuat,
    // hitung selisihnya (load time)
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      console.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000); // Maksimal 10 detik
    });
  });

  // =============================================================================
  // BAGIAN 7: Test Accessibility (Aksesibilitas)
  // Memastikan website bisa diakses oleh semua orang termasuk pengguna screen reader
  // =============================================================================
  test.describe('Accessibility', () => {

    // Test: Memastikan struktur heading benar — hanya ada 1 H1 per halaman
    // (Best practice SEO & aksesibilitas)
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(BASE_URL);

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      expect(h1Count).toBeLessThanOrEqual(1); // Tepat 1 H1
    });

    // Test: Memastikan semua gambar punya atribut alt text
    // Alt text penting untuk screen reader (pembaca layar untuk tunanetra)
    // dan juga muncul jika gambar gagal dimuat
    test('should have alt text on images', async ({ page }) => {
      await page.goto(BASE_URL);

      const images = page.locator('img');
      const count = await images.count();

      // Loop setiap gambar, pastikan punya alt text
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy(); // Alt text tidak boleh kosong
      }
    });

    // Test: Memastikan tag <html> punya atribut lang="id" (halaman Indonesia)
    // Atribut lang membantu screen reader menentukan bahasa yang digunakan
    test('should have proper lang attribute', async ({ page }) => {
      await page.goto(BASE_URL);

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe('id');
    });

    // Test: Sama seperti di atas, tapi untuk halaman English harus lang="en"
    test('should have proper lang attribute on EN page', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/`);

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe('en');
    });
  });
});
