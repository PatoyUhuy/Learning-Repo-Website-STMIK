package testutil

import (
	"context"

	"github.com/idtazkia/stmik-admission-api/internal/model"
	"github.com/stretchr/testify/suite"
)

// ============================================================================
// STRUCT: BaseTestSuite
// Tujuan: Menjadi kerangka utama (testing framework lifecycle) untuk semua
//         test scenario di Golang. Struct ini menggunakan library testify/suite.
// ============================================================================
type BaseTestSuite struct {
	suite.Suite
	TestDB *TestDB
	Ctx    context.Context
}

// ============================================================================
// LIFECYCLE 1: SetupSuite
// Kapan jalan: SATU KALI saja sebelum seluruh test dalam satu file/suite dimulai.
// Tujuan: Bootstrapping seperti menyalakan Docker DB dan koneksi database.
// ============================================================================
func (s *BaseTestSuite) SetupSuite() {
	s.Ctx = context.Background()
	
	// Kegunaan: Membuat container database PostgreSQL di Docker untuk testing
	s.TestDB = SetupTestDB(s.T())

	// Kegunaan: Menghubungkan model/ORM ke database testing
	err := model.Connect(s.Ctx, s.TestDB.ConnectionStr)
	s.Require().NoError(err, "gagal menghubungkan ke test database")
}

// ============================================================================
// LIFECYCLE 2: TearDownSuite
// Kapan jalan: SATU KALI saja setelah seluruh test dalam satu file/suite selesai.
// Tujuan: Cleanup/bersih-bersih (mematikan Docker DB, menutup koneksi).
// ============================================================================
func (s *BaseTestSuite) TearDownSuite() {
	// Kegunaan: Menutup pool koneksi database
	model.Close()
	
	// Kegunaan: Menghentikan dan menghapus container Docker database
	if s.TestDB != nil {
		s.TestDB.Teardown(s.T())
	}
}

// ============================================================================
// LIFECYCLE 3: SetupTest
// Kapan jalan: BERKALI-KALI, yaitu TEPAT SEBELUM SETIAP satu blok test dieksekusi.
// Tujuan: Mereset state/data sebelum test berjalan agar test independen.
// ============================================================================
func (s *BaseTestSuite) SetupTest() {
	// Contoh implementasi (bisa di-uncomment jika butuh reset tabel per test):
	// s.Require().NoError(model.Pool().Exec(s.Ctx, "TRUNCATE TABLE users, candidates, interactions CASCADE"))
}

// ============================================================================
// LIFECYCLE 4: TearDownTest
// Kapan jalan: BERKALI-KALI, yaitu TEPAT SETELAH SETIAP satu blok test selesai.
// Tujuan: Menghapus data sisa dari test yang baru saja berjalan.
// ============================================================================
func (s *BaseTestSuite) TearDownTest() {
	// Logika cleanup setelah masing-masing test (opsional)
}
