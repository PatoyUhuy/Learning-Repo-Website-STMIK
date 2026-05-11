/**
 * ============================================================================
 * FILE: testdb.go
 * ============================================================================
 * Tujuan: Script ini adalah utility (alat bantu) untuk testing backend (Go).
 *         Fungsinya untuk membuat database PostgreSQL sementara (menggunakan Docker)
 *         agar automated test bisa berjalan di database bersih tanpa mengganggu
 *         database asli/production.
 * ============================================================================
 */

// Baris 13 sampai 27 digunakan untuk: Deklarasi package dan import library yang dibutuhkan
package testutil

import (
	"context"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

// Baris 31 sampai 35 digunakan untuk: Struktur data (struct) TestDB
// Berisi objek container (server database docker) dan ConnectionStr (URL koneksi database)
type TestDB struct {
	Container     *postgres.PostgresContainer
	ConnectionStr string
}

// ============================================================================
// FUNGSI: SetupTestDB
// Tujuan: Membuat database sementara, menjalankan migrasi (membuat tabel-tabel),
//         lalu mengembalikan koneksi yang bisa dipakai oleh script test lain.
// ============================================================================
func SetupTestDB(t *testing.T) *TestDB {
	t.Helper() // Menandai ini sebagai fungsi helper (pesan error akan menunjuk ke pemanggilnya)
	ctx := context.Background() // Membuat konteks dasar

	// Baris 50 sampai 60 digunakan untuk: Membuat container Docker berisi database PostgreSQL versi 18
	// - Nama database: test_db
	// - Username: test
	// - Password: test
	// - Menunggu sampai database siap menerima koneksi (muncul tulisan "database system is ready")
	container, err := postgres.Run(ctx, "postgres:18-alpine",
		postgres.WithDatabase("test_db"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2)),
	)
	if err != nil {
		t.Fatalf("failed to start postgres container: %v", err) // Gagalkan test jika error
	}

	// Baris 63 sampai 67 digunakan untuk: Mendapatkan URL string koneksi dari container yang baru dibuat
	connStr, err := container.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		container.Terminate(ctx) // Matikan container jika gagal
		t.Fatalf("failed to get connection string: %v", err)
	}

	// ============================================================================
	// Bagian ini bertugas untuk menjalankan MIGRASI database.
	// Artinya, tabel-tabel (seperti users, candidates) akan otomatis dibuat
	// di database sementara tersebut.
	// ============================================================================

	// Baris 76 digunakan untuk: Ambil lokasi folder migrasi
	migrationsPath := getMigrationsPath()

	// Baris 79 sampai 83 digunakan untuk: Buat objek migrasi yang menghubungkan file migrasi dengan database
	m, err := migrate.New("file://"+migrationsPath, connStr)
	if err != nil {
		container.Terminate(ctx)
		t.Fatalf("failed to create migrate instance: %v", err)
	}

	// Baris 86 sampai 89 digunakan untuk: Jalankan migrasi (m.Up()). Jika error selain "tidak ada perubahan", test digagalkan.
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		container.Terminate(ctx)
		t.Fatalf("failed to run migrations: %v", err)
	}

	// Baris 92 sampai 95 digunakan untuk: Kembalikan objek database yang siap digunakan
	return &TestDB{
		Container:     container,
		ConnectionStr: connStr,
	}
}

// ============================================================================
// FUNGSI: Teardown
// Tujuan: Mematikan (menghapus) container database Docker setelah test selesai.
//         Ini penting agar RAM komputer tidak penuh oleh database sisa test.
// ============================================================================
func (tdb *TestDB) Teardown(t *testing.T) {
	t.Helper()
	if err := tdb.Container.Terminate(context.Background()); err != nil {
		t.Errorf("failed to terminate container: %v", err)
	}
}

// ============================================================================
// FUNGSI: getMigrationsPath
// Tujuan: Mencari lokasi folder "migrations" (tempat file SQL berada) secara
//         otomatis, di folder manapun script test ini dijalankan.
// ============================================================================
func getMigrationsPath() string {
	_, filename, _, _ := runtime.Caller(0) // Dapatkan alamat file ini (testdb.go)
	// Naik 2 folder ke atas (..), lalu masuk ke folder "migrations"
	return filepath.Join(filepath.Dir(filename), "..", "..", "migrations")
}
