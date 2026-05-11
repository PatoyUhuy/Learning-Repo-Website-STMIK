# Penjelasan Kode Test - PMB CRM STMIK Tazkia

Dokumen ini menjelaskan fungsi setiap bagian kode pada file-file test.

---

## File 1: `tests/deployment-check.spec.ts`

> [!NOTE]
> File ini digunakan untuk mengecek apakah website yang sudah di-deploy (`https://stmik.tazkia.ac.id`) berfungsi dengan baik. Ini bukan test untuk server lokal, tapi untuk **production website**.

### Import & Konfigurasi (Baris 1–3)

```typescript
import { test, expect } from '@playwright/test';
const BASE_URL = 'https://stmik.tazkia.ac.id';
```

- **Baris 1**: Mengimpor fungsi `test` (untuk mendefinisikan test) dan `expect` (untuk membuat assertion/pernyataan yang harus benar) dari library Playwright.
- **Baris 3**: Mendefinisikan URL website production yang akan di-test sebagai konstanta `BASE_URL`.

### Indonesian Homepage (Baris 6–140)

- **Baris 7–10** (`should load homepage without errors`): Membuka homepage dan memastikan server merespons dengan HTTP status 200 (OK, tidak error).
- **Baris 12–25** (`should display site name and logo`): Memastikan judul halaman mengandung "STMIK Tazkia", logo gambar terlihat, dan heading `<h1>` yang berisi "STMIK Tazkia" muncul di halaman.
- **Baris 27–39** (`should have no console errors`): Mendengarkan semua pesan error di console browser. Jika ada error JavaScript saat halaman dimuat, test ini akan gagal.
- **Baris 41–57** (`should load all images without 404`): Memantau semua response HTTP saat halaman dimuat. Jika ada gambar yang mengembalikan status 404 (Not Found), test gagal. Ini memastikan semua asset gambar tersedia.
- **Baris 59–75** (`should load all stylesheets without errors`): Sama seperti gambar, tapi mengecek file CSS. Memastikan semua stylesheet bisa dimuat tanpa error.
- **Baris 77–87** (`should have navigation menu`): Mencari link navigasi di header. Memastikan minimal ada 1 link navigasi di halaman.
- **Baris 89–100** (`should have footer with contact info`): Memastikan footer terlihat dan mengandung informasi kontak (nomor telepon atau alamat).
- **Baris 102–112** (`should have working CTA buttons`): Mencari tombol "Daftar Sekarang" (Call-to-Action), memastikan terlihat dan memiliki atribut `href` (link tujuan).
- **Baris 114–124** (`should display features section`): Memastikan bagian "Keunggulan" terlihat dan memiliki lebih dari 2 item feature (ditandai tag `<h3>`).
- **Baris 126–139** (`should display programs section`): Memastikan bagian "Program Studi" terlihat, dan nama program "Sistem Informasi" serta "Teknik Informatika" muncul.

### English Homepage (Baris 142–173)

- **Baris 143–146** (`should load English homepage`): Membuka versi Inggris halaman (`/en/`) dan memastikan status 200.
- **Baris 148–154** (`should display content in English`): Memastikan halaman mengandung konten berbahasa Inggris seperti "Learn more", "Apply now", dll.
- **Baris 156–172** (`should load logo on English page`): Mengecek semua gambar di halaman EN tidak ada yang 404.

### Language Switching (Baris 175–183)

- **Baris 176–182** (`should have language switcher`): Memastikan ada link atau tombol untuk berganti bahasa (ke halaman EN).

### Responsive Design (Baris 185–214)

- **Baris 186–197** (`should be mobile responsive`): Mengatur ukuran layar ke 375×667 (iPhone), lalu memastikan logo dan heading tetap terlihat.
- **Baris 199–205** (`should be tablet responsive`): Mengatur ukuran layar ke 768×1024 (iPad), memastikan heading terlihat.
- **Baris 207–213** (`should be desktop responsive`): Mengatur ukuran layar ke 1920×1080 (Full HD), memastikan heading terlihat.

### SEO and Meta Tags (Baris 216–242)

- **Baris 217–227** (`should have proper meta tags`): Memastikan ada tag `<meta name="description">` yang terisi dan tag Open Graph (`og:title`) untuk social media sharing.
- **Baris 229–236** (`should have sitemap`): Mengakses `/sitemap-index.xml` dan memastikan file XML sitemap tersedia (untuk SEO/Google indexing).
- **Baris 238–241** (`should have robots.txt`): Memastikan file `robots.txt` tersedia (memberitahu search engine halaman mana yang boleh di-crawl).

### Performance (Baris 244–254)

- **Baris 245–253** (`should load within reasonable time`): Mengukur waktu loading halaman. Test gagal jika loading lebih dari 10 detik.

### Accessibility (Baris 256–294)

- **Baris 257–266** (`should have proper heading hierarchy`): Memastikan halaman memiliki tepat 1 tag `<h1>` (best practice SEO & aksesibilitas).
- **Baris 268–279** (`should have alt text on images`): Loop setiap gambar `<img>` di halaman, memastikan semuanya punya atribut `alt` (untuk screen reader & aksesibilitas).
- **Baris 281–286** (`should have proper lang attribute`): Memastikan tag `<html>` memiliki atribut `lang="id"` pada halaman Indonesia.
- **Baris 288–293** (`should have proper lang attribute on EN page`): Sama seperti di atas, tapi memastikan `lang="en"` di halaman English.

---

## File 2: `tests/scrape-linkedin.ts`

> [!NOTE]
> File ini **bukan file test**, melainkan **utility script** untuk scraping profil LinkedIn menggunakan Playwright. Script ini dijalankan manual via command line, bukan sebagai bagian dari test suite.

### Import & Konfigurasi (Baris 1–20)

```typescript
import { chromium, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
const SESSION_DIR = path.join(process.cwd(), '.linkedin-session');
const STORAGE_STATE_PATH = path.join(SESSION_DIR, 'storage-state.json');
```

- **Baris 15**: Mengimpor `chromium` (browser engine) dan `BrowserContext` dari Playwright.
- **Baris 16–17**: Mengimpor modul Node.js `fs` (file system) dan `path` untuk operasi file.
- **Baris 19–20**: Mendefinisikan folder dan file path untuk menyimpan session login LinkedIn.

### Fungsi `ensureSessionDir()` (Baris 22–26)

- Mengecek apakah folder `.linkedin-session` sudah ada. Jika belum, buat folder tersebut. Digunakan untuk menyimpan cookie/session browser.

### Fungsi `loginToLinkedIn()` (Baris 28–62)

- **Baris 35–37**: Membuka browser Chromium dalam mode **non-headless** (terlihat), agar user bisa login manual.
- **Baris 39–41**: Membuat context browser baru dengan ukuran viewport 1280×800.
- **Baris 45**: Navigasi ke halaman login LinkedIn.
- **Baris 51**: Menunggu sampai user berhasil login dan masuk ke halaman feed (timeout 5 menit).
- **Baris 56**: Setelah login berhasil, menyimpan session state (cookies, localStorage) ke file JSON, sehingga login berikutnya tidak perlu manual.

### Fungsi `scrapeLinkedInProfile()` (Baris 64–219)

- **Baris 69–74**: Mengecek apakah file session sudah ada. Jika belum, minta user login dulu.
- **Baris 76–83**: Membuka browser dengan session yang sudah disimpan (otomatis sudah login).
- **Baris 89**: Navigasi ke URL profil LinkedIn yang diberikan.
- **Baris 92–97**: Mengecek jika ter-redirect ke login (artinya session expired), tampilkan pesan error.
- **Baris 103–109**: Scroll halaman ke bawah 5 kali untuk memuat konten lazy-loaded (LinkedIn memuat konten secara bertahap saat di-scroll).
- **Baris 117–198**: Fungsi `page.evaluate()` — mengeksekusi JavaScript di dalam browser untuk mengekstrak data profil:
  - **Baris 119–120**: Mengambil nama dan headline dari elemen DOM.
  - **Baris 123–124**: Mengambil bagian "About" dari section `#about`.
  - **Baris 127–142**: Mengambil semua pengalaman kerja (title, company, duration, description) dari section `#experience`.
  - **Baris 145–159**: Mengambil semua riwayat pendidikan (institution, degree, years) dari section `#education`.
  - **Baris 162–171**: Mengambil daftar skills dari section `#skills`.
  - **Baris 174–187**: Mengambil sertifikasi dari section `#licenses_and_certifications`.
- **Baris 201–206**: Mencetak raw content dan data terstruktur (JSON) ke console.
- **Baris 209**: Menyimpan ulang session state (refresh cookies).

### Fungsi `isValidLinkedInUrl()` (Baris 225–233)

- Validasi bahwa URL yang diberikan benar-benar URL LinkedIn (`linkedin.com` atau `www.linkedin.com`). Mencegah URL injection.

### Main Execution (Baris 236–274)

- **Baris 238–247**: Jika argument `--login`, jalankan fungsi login.
- **Baris 248–257**: Jika argument adalah URL LinkedIn yang valid, jalankan scraping.
- **Baris 258–273**: Jika tidak ada argument, tampilkan petunjuk penggunaan.

---

## File 3: `backend/test/e2e/pmb-crm-suite.spec.ts`

> [!IMPORTANT]
> Ini adalah **test suite konsolidasi** yang menguji integrasi lintas modul PMB CRM. Total 39 test cases yang semuanya PASS.

### Import & Konfigurasi (Baris 1–2)

```typescript
import { test, expect, Browser } from '@playwright/test';
import { RegistrationPage, LoginPage, PortalPage, CandidatesPage } from './pages';
```

- **Baris 1**: Mengimpor `test`, `expect` dan tipe `Browser` dari Playwright.
- **Baris 2**: Mengimpor Page Object Model (POM) classes dari folder `./pages`. Ini adalah kelas-kelas helper yang meng-encapsulate interaksi dengan halaman tertentu (Registration, Login, Portal, Candidates).

### Helper: `uniqueEmail()` (Baris 13–15)

- Membuat email unik untuk setiap test run menggunakan kombinasi prefix + timestamp + angka random. Contoh output: `pmb17170262000003456@example.com`. Ini mencegah konflik data antar test.

### Helper: `uniquePhone()` (Baris 17–19)

- Membuat nomor telepon unik menggunakan prefix `08` + 10 digit terakhir dari timestamp. Contoh: `081717026200`.

### Helper: `registerCandidate()` (Baris 21–49)

- **Fungsi utama untuk mendaftarkan kandidat baru** secara otomatis melalui 4 langkah registrasi.
- **Baris 24–27**: Menetapkan nilai default (email, phone, name, password) jika tidak diberikan.
- **Baris 29–32**: Membuka halaman registrasi dan memastikan halaman sudah dimuat.
- **Baris 33–36**: **Step 1** — Mengisi email, phone, password → lanjut ke Step 2. **Step 2** — Mengisi nama, alamat, kota, provinsi → lanjut ke Step 3.
- **Baris 38–46**: **Step 3** — Memilih program studi (radio button pertama), mengisi asal sekolah dan tahun lulus → lanjut ke Step 4. **Step 4** — Memilih sumber informasi ('google').
- **Baris 47–48**: Menutup halaman browser dan mengembalikan data kandidat yang didaftarkan.

### Helper: `getCandidateId()` (Baris 51–63)

- **Mencari ID kandidat di panel admin** berdasarkan email.
- **Baris 52–56**: Login sebagai admin, buka halaman candidates, cari berdasarkan email.
- **Baris 57–60**: Ambil semua baris hasil, ekstrak `data-testid` dari baris pertama, dan potong prefix `candidate-row-` untuk mendapatkan UUID kandidat.

### SECTION 1: Role-Based Access Control / RBAC (Baris 65–107)

#### RBAC - Finance Pages Access Control (Baris 69–93)

- **Baris 70–76** (`consultant cannot access finance billing pages`): Login sebagai consultant, coba akses `/admin/finance/billings`. Hasilnya harus **HTTP 403 (Forbidden)** karena consultant tidak punya akses ke halaman keuangan.
- **Baris 78–84** (`finance user can access billing pages`): Login sebagai finance, akses halaman billing. Harus berhasil — elemen `finance-billings-page` harus terlihat.
- **Baris 86–92** (`admin can access billing pages`): Login sebagai admin, akses halaman billing. Harus berhasil juga — admin punya akses ke semua halaman.

#### RBAC - Auth Redirects (Baris 95–107)

- **Baris 96–100** (`unauthenticated user redirected from admin`): Hapus semua cookies (simulasi belum login), akses `/admin`. Harus ter-redirect ke `/admin/login`.
- **Baris 102–106** (`unauthenticated user redirected from portal`): Hapus cookies, akses `/portal`. Harus ter-redirect ke `/login`.

### SECTION 2: Full Candidate Lifecycle / E2E (Baris 109–226)

> [!IMPORTANT]
> Test ini berjalan secara **serial** (berurutan, baris 114), karena setiap step bergantung pada data dari step sebelumnya. Variabel seperti `candidateEmail` dan `candidateId` disharing antar test.

- **Baris 116–120**: Deklarasi variabel shared yang akan diisi oleh Step 1 dan digunakan oleh step-step berikutnya.

#### Step 1: Register new candidate (Baris 122–135)

- **Baris 123–127**: Memanggil helper `registerCandidate()` untuk mendaftarkan kandidat baru. Menyimpan hasilnya ke variabel shared.
- **Baris 129–134**: Verifikasi bahwa kandidat bisa login dengan email dan password yang baru didaftarkan, dan ter-redirect ke portal.

#### Step 2: Candidate appears in admin list (Baris 137–140)

- Login sebagai admin, cari kandidat berdasarkan email, dan simpan UUID-nya ke variabel `candidateId`.

#### Step 3: Candidate detail shows correct data (Baris 142–150)

- **Baris 143–145**: Login admin, buka halaman detail kandidat berdasarkan `candidateId`.
- **Baris 146–148**: Verifikasi bahwa nama dan email yang ditampilkan sesuai dengan data yang didaftarkan.

#### Step 4: Consultant logs interaction (Baris 152–166)

- **Baris 153–155**: Login sebagai consultant, buka form interaksi untuk kandidat tersebut.
- **Baris 157–158**: Pilih channel "WhatsApp" dan kategori pertama (radio button).
- **Baris 159–161**: Isi catatan/remarks dengan teks unik dan klik tombol "Simpan".
- **Baris 163–164**: Verifikasi redirect ke halaman detail dan catatan muncul di timeline interaksi.

#### Step 5: Portal shows status and consultant (Baris 168–181)

- Login sebagai kandidat, cek bahwa portal menampilkan: pesan selamat datang (nama), status "Dalam Proses", dan informasi consultant yang ditugaskan.

#### Step 6: Portal documents page loads (Baris 183–192)

- Login kandidat, buka halaman dokumen (`/portal/documents`). Pastikan heading "KTP" terlihat (salah satu jenis dokumen wajib).

#### Step 7: Portal payments page loads (Baris 194–203)

- Login kandidat, buka halaman pembayaran (`/portal/payments`). Pastikan heading "Pembayaran" terlihat.

#### Step 8: Mark candidate as lost (Baris 205–225)

- **Baris 206–209**: Login admin, buka halaman detail kandidat.
- **Baris 211–223**: Klik tombol "Mark as Lost", pilih alasan dari dropdown (opsi ke-2), konfirmasi. Verifikasi status berubah menjadi "Lost" di header halaman.

### SECTION 3: Cross-Module Integration (Baris 228–292)

#### new registration increases candidate count (Baris 233–252)

- **Baris 234–240**: Ambil jumlah total kandidat sebelum registrasi.
- **Baris 242**: Daftarkan kandidat baru.
- **Baris 244–251**: Ambil jumlah total setelah registrasi, pastikan meningkat (membuktikan data tersimpan ke database dan terefleksi di admin).

#### candidate auto-assigned to consultant (Baris 254–264)

- Daftarkan kandidat baru, buka detail di admin. Pastikan field consultant **bukan** "Belum ditugaskan" — artinya algoritma assignment otomatis berjalan.

#### dashboard stats are numeric (Baris 266–279)

- Login admin, buka dashboard. Loop semua stat cards (Total Kandidat, Prospecting, dll.), pastikan nilainya berupa angka (regex `^\d+$`).

#### funnel overview shows all stages (Baris 281–291)

- Pastikan section funnel menampilkan semua 4 tahapan: Registered, Prospecting, Committed, Enrolled.

### SECTION 4: Security & Edge Cases (Baris 294–359)

#### invalid candidate UUID returns 404 (Baris 299–305)

- Akses halaman detail dengan UUID yang valid formatnya tapi tidak ada di database (`00000000-...`). Harus mengembalikan HTTP 404.

#### malformed UUID returns error (Baris 307–313)

- Akses dengan UUID yang formatnya salah (`invalid-id`). Harus mengembalikan HTTP 404 atau 500.

#### health endpoint accessible without auth (Baris 315–320)

- Menggunakan `request` fixture (bukan browser), akses endpoint `/health` **tanpa autentikasi**. Pastikan status `ok` dan ada info version.

#### cross-origin POST blocked (Baris 322–328)

- Kirim POST request dengan header `Origin: https://evil-site.com` dan `Sec-Fetch-Site: cross-site`. Server harus memblokir dengan **HTTP 403** (CSRF protection).

#### login creates valid session (Baris 332–342)

- Register kandidat, login, lalu akses halaman lain (`/portal/documents`). Pastikan session aktif dan tidak ter-redirect ke login.

#### logout invalidates session (Baris 344–358)

- Login, lalu logout. Pastikan redirect ke `/login`. Coba akses `/portal` lagi — harus ter-redirect ke `/login` (session sudah invalidated).

### SECTION 5: Admin Settings Smoke Tests (Baris 361–390)

- **Baris 366–369** (`beforeEach`): Sebelum setiap test, login sebagai admin dan tunggu redirect ke dashboard.
- **Baris 371–382**: Array berisi 10 halaman settings beserta `data-testid` yang diharapkan:
  - Programs, Users, Campaigns, Referrers, Fees, Document Types, Lost Reasons, Assignment, Rewards, Categories.
- **Baris 384–389**: Loop untuk setiap halaman — buka URL dan pastikan elemen dengan `data-testid` yang sesuai terlihat. Ini adalah **smoke test** (tes cepat untuk memastikan halaman tidak error/crash).

### SECTION 6: Report & Commission Smoke Tests (Baris 392–441)

#### Reports - Smoke Tests (Baris 396–421)

- **Baris 397–400** (`beforeEach`): Login admin sebelum setiap test.
- **Baris 402–405**: Buka `/admin/reports/funnel`, pastikan heading "Laporan Funnel" terlihat.
- **Baris 407–410**: Buka `/admin/reports/campaigns`, pastikan heading "Laporan ROI Kampanye" terlihat.
- **Baris 412–415**: Buka `/admin/reports/consultants`, pastikan elemen `consultant-report-page` terlihat.
- **Baris 417–420**: Buka `/admin/reports/referrers`, pastikan heading "Leaderboard Referrer" terlihat.

#### Commissions - Smoke Tests (Baris 423–440)

- **Baris 424–430** (`admin can access commissions`): Login admin, buka halaman commissions, pastikan elemen `commissions-page` terlihat.
- **Baris 432–439** (`CSV export returns valid response`): Login admin, akses endpoint export CSV (`/admin/commissions/export?status=approved`). Pastikan status 200 dan `content-type` adalah `text/csv`.

---

## Ringkasan Konsep Penting

| Konsep | Penjelasan |
|--------|-----------|
| `test.describe()` | Mengelompokkan test yang berhubungan (seperti folder) |
| `test.beforeEach()` | Kode yang dijalankan **sebelum setiap** test dalam group |
| `test.beforeAll()` | Kode yang dijalankan **sekali** sebelum semua test dalam group |
| `test.describe.configure({ mode: 'serial' })` | Memaksa test berjalan berurutan (default: paralel) |
| `expect(x).toBe(y)` | Assertion: x harus sama persis dengan y |
| `expect(x).toBeVisible()` | Assertion: elemen x harus terlihat di halaman |
| `expect(x).toContainText('...')` | Assertion: elemen x harus mengandung teks tertentu |
| `expect(x).toHaveURL(/regex/)` | Assertion: URL halaman harus cocok dengan regex |
| `page.getByTestId('id')` | Mencari elemen berdasarkan atribut `data-testid` |
| `page.locator('css')` | Mencari elemen berdasarkan CSS selector |
| `page.goto('/path')` | Navigasi ke URL tertentu |
| `browser.newPage()` | Membuat tab browser baru (untuk isolasi session) |
| `page.context().clearCookies()` | Menghapus semua cookies (simulasi belum login) |
| `{ request }` fixture | Mengirim HTTP request langsung tanpa membuka browser |
| Page Object Model (POM) | Pattern di mana interaksi halaman di-encapsulate dalam class (`RegistrationPage`, `LoginPage`, dll.) agar test lebih bersih dan reusable |
