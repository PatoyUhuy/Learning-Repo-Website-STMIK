const fs = require('fs');
const path = require('path');

const dirPath = 'e:\\website-stmik\\backend\\test\\e2e';
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.spec.ts') && f !== 'pmb-crm-suite.spec.ts');

function addAutoComments(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('// Baris')) return;

    let lines = content.split('\n');
    let outLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmed = line.trim();

        let comment = null;

        if (trimmed.startsWith('test.describe(')) {
            let descMatch = trimmed.match(/^test\.describe\((['"`])(.*?)\1/);
            let title = descMatch ? descMatch[2] : 'grup ini';
            comment = '// Kode di bawah ini digunakan untuk: Mengelompokkan skenario pengujian tentang "' + title + '"';
        } else if (trimmed.startsWith('test(')) {
            let testMatch = trimmed.match(/^test\((['"`])(.*?)\1/);
            let title = testMatch ? testMatch[2] : 'fitur ini';
            comment = '// Kode di bawah ini digunakan untuk: Memulai eksekusi pengujian dengan judul "' + title + '"';
        } else if (trimmed.startsWith('test.beforeEach')) {
            comment = '// Kode di bawah ini digunakan untuk: Menjalankan fungsi persiapan (setup) SEBELUM setiap test dijalankan';
        } else if (trimmed.includes('await page.goto(')) {
            let urlMatch = trimmed.match(/await page\.goto\((['"`])(.*?)\1/);
            let url = urlMatch ? urlMatch[2] : 'tujuan';
            comment = '// Kode di bawah ini digunakan untuk: Membuka browser dan menavigasi ke halaman "' + url + '"';
        } else if (trimmed.includes('await page.locator(') || trimmed.includes('await page.getBy')) {
            if (trimmed.includes('.click()')) {
                comment = '// Kode di bawah ini digunakan untuk: Mencari elemen di layar lalu mengkliknya (simulasi klik mouse)';
            } else if (trimmed.includes('.fill(')) {
                comment = '// Kode di bawah ini digunakan untuk: Mengisi kolom input teks (simulasi mengetik keyboard)';
            } else if (trimmed.includes('.selectOption(')) {
                comment = '// Kode di bawah ini digunakan untuk: Memilih opsi dari menu dropdown';
            }
        } else if (trimmed.includes('await expect(')) {
            if (trimmed.includes('.toBeVisible()')) {
                comment = '// Kode di bawah ini digunakan untuk: Memastikan elemen tersebut benar-benar terlihat di layar oleh pengguna';
            } else if (trimmed.includes('.toHaveURL(')) {
                comment = '// Kode di bawah ini digunakan untuk: Memastikan URL browser sudah berubah/sesuai dengan yang diharapkan';
            } else if (trimmed.includes('.toContainText(')) {
                comment = '// Kode di bawah ini digunakan untuk: Memastikan ada teks tertentu yang muncul di dalam elemen tersebut';
            } else {
                comment = '// Kode di bawah ini digunakan untuk: Melakukan pengecekan (validasi) apakah hasilnya sesuai ekspektasi';
            }
        } else if (trimmed.includes('await page.close()')) {
            comment = '// Kode di bawah ini digunakan untuk: Menutup tab browser setelah pengujian selesai agar tidak memakan memori';
        } else if (trimmed.includes('new ') && trimmed.includes('Page(')) {
            comment = '// Kode di bawah ini digunakan untuk: Menyiapkan file helper halaman (Page Object) untuk mempermudah interaksi';
        } else if (trimmed.startsWith('const page = await browser.newPage()')) {
            comment = '// Kode di bawah ini digunakan untuk: Membuka tab browser baru yang masih bersih (kosong)';
        }

        if (comment) {
            let indent = line.match(/^\s*/)[0];
            outLines.push(indent + comment);
        }
        outLines.push(line);
    }

    let finalLines = [];
    for (let i = 0; i < outLines.length; i++) {
        let line = outLines[i];
        if (line.includes('// Kode di bawah ini digunakan untuk:')) {
            let newStart = i + 2;
            line = line.replace('// Kode di bawah ini digunakan untuk:', '// Baris ' + newStart + ' digunakan untuk:');
        }
        finalLines.push(line);
    }

    fs.writeFileSync(filePath, finalLines.join('\n'), 'utf8');
}

files.forEach(f => {
    addAutoComments(path.join(dirPath, f));
});
console.log('Processed ' + files.length + ' files in e2e directory.');
