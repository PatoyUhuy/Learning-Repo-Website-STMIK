/**
 * ============================================================================
 * FILE: scrape-linkedin.ts
 * ============================================================================
 * Tujuan: Script ini adalah utility/alat bantu untuk melakukan scraping
 *         (pengambilan data otomatis) profil LinkedIn menggunakan Playwright.
 *         Script ini dijalankan manual, BUKAN sebagai bagian dari automated test.
 *
 * Cara Penggunaan:
 *   1. Pertama kali (Login & simpan sesi browser):
 *      npx tsx tests/scrape-linkedin.ts --login
 *
 *   2. Melakukan scraping profil (setelah login):
 *      npx tsx tests/scrape-linkedin.ts "https://www.linkedin.com/in/username"
 * ============================================================================
 */

// Baris 20 sampai 22 digunakan untuk: Mengimpor modul Chromium dari Playwright (untuk menjalankan browser)
// dan modul file system/path bawaan Node.js untuk menyimpan file sesi.
import { chromium, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Baris 26 sampai 27 digunakan untuk: Menentukan lokasi folder dan file tempat cookie/sesi LinkedIn
// akan disimpan, agar kita tidak perlu login berulang kali.
const SESSION_DIR = path.join(process.cwd(), '.linkedin-session');
const STORAGE_STATE_PATH = path.join(SESSION_DIR, 'storage-state.json');

// Baris 31 sampai 35 digunakan untuk: Fungsi memastikan folder tempat menyimpan sesi sudah dibuat.
// Jika belum ada, folder tersebut akan dibuat (fs.mkdirSync).
async function ensureSessionDir() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }
}

// ============================================================================
// FUNGSI: loginToLinkedIn
// Tujuan: Membuka browser yang terlihat (non-headless) agar pengguna bisa
//         login secara manual, lalu menyimpan sesi/cookie-nya.
// ============================================================================
async function loginToLinkedIn() {
  console.log('\n=== LinkedIn Login ===\n');
  console.log('A browser window will open. Please log in to LinkedIn manually.');
  console.log('After logging in, the session will be saved automatically.\n');

  await ensureSessionDir(); // Pastikan foldernya ada

  // Baris 50 sampai 52 digunakan untuk: Buka browser Chrome secara terlihat (headless: false)
  const browser = await chromium.launch({
    headless: false,
  });

  // Baris 55 sampai 57 digunakan untuk: Buat tab browser baru dengan resolusi 1280x800
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  // Baris 62 digunakan untuk: Buka halaman login LinkedIn
  await page.goto('https://www.linkedin.com/login');

  console.log('Waiting for you to log in...');
  console.log('(The script will continue automatically once you reach the feed page)\n');

  // Baris 69 digunakan untuk: Menunggu sampai URL berubah menjadi /feed/ (tanda login berhasil)
  // Maksimal waktu tunggu adalah 5 menit (300000 ms)
  await page.waitForURL('**/feed/**', { timeout: 300000 }); 

  console.log('Login successful! Saving session...');

  // Baris 74 digunakan untuk: Menyimpan sesi browser (cookie dll) ke file JSON
  await context.storageState({ path: STORAGE_STATE_PATH });

  console.log(`Session saved to: ${STORAGE_STATE_PATH}`);
  console.log('\nYou can now run the scraper without logging in again.');

  // Tutup browser setelah selesai
  await browser.close();
}

// ============================================================================
// FUNGSI: scrapeLinkedInProfile
// Tujuan: Mengunjungi sebuah URL profil LinkedIn dan mengambil datanya
//         (nama, about, pengalaman, pendidikan, skill) secara otomatis.
// ============================================================================
async function scrapeLinkedInProfile(url: string) {
  console.log(`\n=== Scraping LinkedIn Profile ===`);
  console.log(`URL: ${url}\n`);

  // Baris 94 sampai 99 digunakan untuk: Cek apakah file sesi login ada. Jika tidak ada,
  // beri tahu pengguna untuk menjalankan script dengan flag --login.
  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    console.error('Error: No LinkedIn session found.');
    console.error('Please run with --login first to authenticate:\n');
    console.error('  npx tsx tests/scrape-linkedin.ts --login\n');
    process.exit(1);
  }

  // Baris 102 sampai 104 digunakan untuk: Buka browser secara terlihat (agar kita bisa memantau prosesnya)
  const browser = await chromium.launch({
    headless: false, 
  });

  // Baris 108 sampai 111 digunakan untuk: Masukkan data sesi (cookies) yang sudah tersimpan
  // sehingga browser sudah dalam keadaan login LinkedIn.
  const context = await browser.newContext({
    storageState: STORAGE_STATE_PATH,
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    // Baris 117 digunakan untuk: Pergi ke URL profil LinkedIn yang diminta
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Baris 121 sampai 126 digunakan untuk: Jika URL tiba-tiba berubah ke /login, berarti
    // sesi sudah expired/kadaluarsa. Program dihentikan.
    if (page.url().includes('/login')) {
      console.error('\nError: Session expired. Please login again:');
      console.error('  npx tsx tests/scrape-linkedin.ts --login\n');
      await browser.close();
      process.exit(1);
    }

    // Baris 129 digunakan untuk: Tunggu sampai nama profil (H1) muncul di halaman
    await page.waitForSelector('h1', { timeout: 10000 });

    // Baris 133 sampai 139 digunakan untuk: Script untuk men-scroll halaman ke bawah beberapa kali
    // LinkedIn memuat data pengalaman/pendidikan secara lazy-load (bertahap).
    await page.evaluate(async () => {
      for (let i = 0; i < 5; i++) {
        window.scrollBy(0, 800); // Scroll 800px ke bawah
        await new Promise(resolve => setTimeout(resolve, 500)); // Jeda setengah detik
      }
      window.scrollTo(0, 0); // Kembali ke atas
    });

    // Baris 142 digunakan untuk: Tunggu sebentar agar animasi dan data termuat sempurna
    await page.waitForTimeout(2000);

    console.log('=== Extracting profile data ===\n');

    // Baris 148 sampai 229 digunakan untuk: Fungsi ini dijalankan di dalam browser (evaluate)
    // untuk mengekstrak teks dari elemen-elemen HTML (DOM).
    const profileData = await page.evaluate(() => {
      // Ambil Nama dan Headline profesi
      const name = document.querySelector('h1')?.textContent?.trim() || '';
      const headline = document.querySelector('.text-body-medium')?.textContent?.trim() || '';

      // Ambil bagian "About" (Tentang Saya)
      const aboutSection = document.querySelector('#about')?.closest('section');
      const about = aboutSection?.querySelector('.inline-show-more-text')?.textContent?.trim() || '';

      // Ambil bagian Pengalaman Kerja (Experience)
      const experienceSection = document.querySelector('#experience')?.closest('section');
      const experiences: any[] = [];

      if (experienceSection) {
        // Cari semua list item pekerjaan
        const expItems = experienceSection.querySelectorAll(':scope > div > ul > li');
        expItems.forEach(item => {
          // Ambil jabatan, nama perusahaan, durasi kerja, dan deskripsi tugas
          const title = item.querySelector('.t-bold span')?.textContent?.trim() || '';
          const company = item.querySelector('.t-normal span')?.textContent?.trim() || '';
          const duration = item.querySelector('.t-normal.t-black--light span')?.textContent?.trim() || '';
          const description = item.querySelector('.inline-show-more-text')?.textContent?.trim() || '';

          if (title || company) {
            experiences.push({ title, company, duration, description });
          }
        });
      }

      // Ambil bagian Pendidikan (Education)
      const educationSection = document.querySelector('#education')?.closest('section');
      const education: any[] = [];

      if (educationSection) {
        const eduItems = educationSection.querySelectorAll(':scope > div > ul > li');
        eduItems.forEach(item => {
          // Ambil nama kampus, gelar, dan tahun kuliah
          const institution = item.querySelector('.t-bold span')?.textContent?.trim() || '';
          const degree = item.querySelector('.t-normal span')?.textContent?.trim() || '';
          const years = item.querySelector('.t-normal.t-black--light span')?.textContent?.trim() || '';

          if (institution) {
            education.push({ institution, degree, years });
          }
        });
      }

      // Ambil bagian Keahlian (Skills)
      const skillsSection = document.querySelector('#skills')?.closest('section');
      const skills: string[] = [];

      if (skillsSection) {
        const skillItems = skillsSection.querySelectorAll('.t-bold span[aria-hidden="true"]');
        skillItems.forEach(item => {
          const skill = item.textContent?.trim();
          if (skill) skills.push(skill);
        });
      }

      // Ambil bagian Sertifikasi (Certifications)
      const certsSection = document.querySelector('#licenses_and_certifications')?.closest('section');
      const certifications: any[] = [];

      if (certsSection) {
        const certItems = certsSection.querySelectorAll(':scope > div > ul > li');
        certItems.forEach(item => {
          // Ambil nama sertifikat dan instansi penerbit
          const certName = item.querySelector('.t-bold span')?.textContent?.trim() || '';
          const issuer = item.querySelector('.t-normal span')?.textContent?.trim() || '';

          if (certName) {
            certifications.push({ name: certName, issuer });
          }
        });
      }

      // Kembalikan semua data terstruktur dalam bentuk objek
      return {
        name,
        headline,
        about,
        experiences,
        education,
        skills,
        certifications,
      };
    });

    // Baris 237 digunakan untuk: Ambil semua teks kasar dari halaman (sebagai backup jika struktur JSON gagal)
    const rawContent = await page.textContent('main') || '';

    console.log(rawContent);

    console.log('\n=== Structured Data (JSON) ===\n');
    console.log(JSON.stringify(profileData, null, 2));

    // Baris 245 digunakan untuk: Simpan ulang sesi karena cookies mungkin saja diperbarui oleh server
    await context.storageState({ path: STORAGE_STATE_PATH });

    return { profileData, rawContent };

  } catch (error) {
    console.error('Error scraping profile:', error);
    throw error;
  } finally {
    await browser.close(); // Selalu tutup browser setelah selesai
  }
}

// ============================================================================
// FUNGSI: isValidLinkedInUrl
// Tujuan: Mengecek keamanan URL. Memastikan hanya URL dari linkedin.com
//         yang bisa diproses (mencegah eksploitasi keamanan/URL injection).
// ============================================================================
function isValidLinkedInUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.hostname === 'linkedin.com' || url.hostname === 'www.linkedin.com';
  } catch {
    return false;
  }
}

// ============================================================================
// BAGIAN UTAMA PROGRAM (Main Execution)
// Mengambil argumen dari baris perintah terminal (command line args)
// ============================================================================
const args = process.argv.slice(2);

// Jika pengguna mengetik `--login`
if (args.includes('--login')) {
  loginToLinkedIn()
    .then(() => {
      console.log('\n=== Login completed ===');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Login failed:', error);
      process.exit(1);
    });
} 
// Jika pengguna memberikan URL valid
else if (args.length > 0 && isValidLinkedInUrl(args[0])) {
  scrapeLinkedInProfile(args[0])
    .then(() => {
      console.log('\n=== Scraping completed ===');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Scraping failed:', error);
      process.exit(1);
    });
} 
// Jika tidak ada parameter, tampilkan cara pemakaian (bantuan)
else {
  console.log(`
LinkedIn Profile Scraper

Usage:
  1. Login first (one-time):
     npx tsx tests/scrape-linkedin.ts --login

  2. Scrape a profile:
     npx tsx tests/scrape-linkedin.ts "https://www.linkedin.com/in/username"

Options:
  --login    Open browser to login and save session
  <url>      LinkedIn profile URL to scrape
`);
  process.exit(0);
}
