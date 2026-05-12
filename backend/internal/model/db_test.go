package model_test

import (
	"testing"

	"github.com/idtazkia/stmik-admission-api/internal/model"
	"github.com/idtazkia/stmik-admission-api/test/testutil"
	"github.com/stretchr/testify/suite"
)

// ============================================================================
// STRUCT: DatabaseTestSuite
// Tujuan: Menggunakan BaseTestSuite untuk mewarisi testing lifecycle (Setup, TearDown).
//         Ini sesuai standar framework testify/suite yang digunakan di project ini.
// ============================================================================
type DatabaseTestSuite struct {
	testutil.BaseTestSuite
}

// Kegunaan: Fungsi entry-point yang dikenali oleh 'go test'.
// Fungsi ini yang memicu jalannya lifecycle (SetupSuite -> Test... -> TearDownSuite).
func TestDatabaseSuite(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}
	suite.Run(t, new(DatabaseTestSuite))
}

// ============================================================================
// DAFTAR TEST SCENARIOS
// Setiap fungsi yang diawali dengan 'Test' akan dieksekusi secara berurutan.
// Sebelum fungsi ini jalan, SetupTest() dipanggil. Setelahnya TearDownTest().
// ============================================================================

// Kegunaan: Mengecek apakah tabel 'users' ada di database dan memiliki kolom yang benar
func (s *DatabaseTestSuite) TestUsersTableExistsWithCorrectColumns() {
	pool := model.Pool()
	var exists bool
	err := pool.QueryRow(s.Ctx, `
		SELECT EXISTS (
			SELECT FROM information_schema.tables
			WHERE table_name = 'users'
		)
	`).Scan(&exists)
	s.Require().NoError(err, "failed to check users table")
	s.True(exists, "users table does not exist")

	// Kegunaan: Mendefinisikan daftar kolom yang wajib ada di tabel 'users'
	columns := []string{"id", "email", "name", "google_id", "role", "id_supervisor", "is_active", "last_login_at", "created_at", "updated_at"}
	for _, col := range columns {
		var colExists bool
		err := pool.QueryRow(s.Ctx, `
			SELECT EXISTS (
				SELECT FROM information_schema.columns
				WHERE table_name = 'users' AND column_name = $1
			)
		`, col).Scan(&colExists)
		s.Require().NoError(err, "failed to check column %s", col)
		s.True(colExists, "column %s does not exist in users table", col)
	}
}

// Kegunaan: Mengecek apakah tabel 'candidates' ada di database dan memiliki kolom yang benar
func (s *DatabaseTestSuite) TestCandidatesTableExistsWithCorrectColumns() {
	pool := model.Pool()
	var exists bool
	err := pool.QueryRow(s.Ctx, `
		SELECT EXISTS (
			SELECT FROM information_schema.tables
			WHERE table_name = 'candidates'
		)
	`).Scan(&exists)
	s.Require().NoError(err, "failed to check candidates table")
	s.True(exists, "candidates table does not exist")

	columns := []string{"id", "email", "phone", "name", "status", "prodi_id", "assigned_consultant_id", "created_at", "updated_at"}
	for _, col := range columns {
		var colExists bool
		err := pool.QueryRow(s.Ctx, `
			SELECT EXISTS (
				SELECT FROM information_schema.columns
				WHERE table_name = 'candidates' AND column_name = $1
			)
		`, col).Scan(&colExists)
		s.Require().NoError(err, "failed to check column %s", col)
		s.True(colExists, "column %s does not exist in candidates table", col)
	}
}

// Kegunaan: Mengecek apakah tabel 'interactions' ada di database dan memiliki kolom yang benar
func (s *DatabaseTestSuite) TestInteractionsTableExistsWithCorrectColumns() {
	pool := model.Pool()
	var exists bool
	err := pool.QueryRow(s.Ctx, `
		SELECT EXISTS (
			SELECT FROM information_schema.tables
			WHERE table_name = 'interactions'
		)
	`).Scan(&exists)
	s.Require().NoError(err, "failed to check interactions table")
	s.True(exists, "interactions table does not exist")

	columns := []string{"id", "candidate_id", "consultant_id", "channel", "category_id", "obstacle_id", "remarks", "next_followup_date", "created_at"}
	for _, col := range columns {
		var colExists bool
		err := pool.QueryRow(s.Ctx, `
			SELECT EXISTS (
				SELECT FROM information_schema.columns
				WHERE table_name = 'interactions' AND column_name = $1
			)
		`, col).Scan(&colExists)
		s.Require().NoError(err, "failed to check column %s", col)
		s.True(colExists, "column %s does not exist in interactions table", col)
	}
}

// Kegunaan: Menguji apakah INSERT dan SELECT ke tabel 'users' berfungsi dengan benar
func (s *DatabaseTestSuite) TestCanInsertAndQueryUser() {
	pool := model.Pool()
	var userID string
	err := pool.QueryRow(s.Ctx, `
		INSERT INTO users (email, name, role)
		VALUES ('test@example.com', 'Test User', 'consultant')
		RETURNING id
	`).Scan(&userID)
	s.Require().NoError(err, "failed to insert user")

	var email, name, role string
	err = pool.QueryRow(s.Ctx, `SELECT email, name, role FROM users WHERE id = $1`, userID).Scan(&email, &name, &role)
	s.Require().NoError(err, "failed to query user")

	// Kegunaan: Memastikan isi data sama persis dengan yang kita input
	s.Equal("test@example.com", email, "expected email to match")
	s.Equal("Test User", name, "expected name to match")
	s.Equal("consultant", role, "expected role to match")
}

// Kegunaan: Menguji apakah foreign key constraint antara candidates dan users berjalan
func (s *DatabaseTestSuite) TestForeignKeyConstraintWorksForCandidates() {
	pool := model.Pool()
	var userID string
	err := pool.QueryRow(s.Ctx, `
		INSERT INTO users (email, name, role)
		VALUES ('consultant2@example.com', 'Consultant', 'consultant')
		RETURNING id
	`).Scan(&userID)
	s.Require().NoError(err, "failed to insert user")

	var candidateID string
	err = pool.QueryRow(s.Ctx, `
		INSERT INTO candidates (email, name, password_hash, status, assigned_consultant_id)
		VALUES ('candidate@example.com', 'Test Candidate', '$2a$10$dummyhashfortesting', 'registered', $1)
		RETURNING id
	`, userID).Scan(&candidateID)
	s.Require().NoError(err, "failed to insert candidate")

	var count int
	err = pool.QueryRow(s.Ctx, `SELECT COUNT(*) FROM candidates WHERE id = $1`, candidateID).Scan(&count)
	s.Require().NoError(err, "failed to count candidates")
	s.Equal(1, count, "expected 1 candidate")
}
