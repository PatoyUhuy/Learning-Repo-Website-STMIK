package integration_test

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"

	"github.com/idtazkia/stmik-admission-api/internal/auth"
	"github.com/idtazkia/stmik-admission-api/internal/handler"
	"github.com/idtazkia/stmik-admission-api/internal/model"
	"github.com/idtazkia/stmik-admission-api/internal/pkg/crypto"
	"github.com/idtazkia/stmik-admission-api/test/testutil"
	"github.com/stretchr/testify/suite"
)

// ============================================================================
// STRUCT: CandidateFlowTestSuite
// Tujuan: Menguji alur integrasi Backend (API -> Logic -> DB) tanpa browser.
//         Menggunakan testify/suite sesuai standar framework project ini.
// ============================================================================
type CandidateFlowTestSuite struct {
	testutil.BaseTestSuite
	publicHandler *handler.PublicHandler
	sessionMgr    *auth.SessionManager
	mux           *http.ServeMux
}

// Kegunaan: Menyiapkan komponen backend yang diperlukan sebelum test dimulai
func (s *CandidateFlowTestSuite) SetupSuite() {
	// Kegunaan: Memanggil SetupSuite dasar untuk menyalakan Database Docker
	s.BaseTestSuite.SetupSuite()

	// Kegunaan: Menyiapkan Encryption (Kunci Master) agar model bisa mengenkripsi email
	// Kunci harus dalam format Hex (64 karakter untuk 32 byte)
	crypto.Init("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")

	// Kegunaan: Menyiapkan Session Manager (JWT) untuk simulasi login
	s.sessionMgr = auth.NewSessionManager("test-secret-key-123", 0, false)

	// Kegunaan: Menyiapkan Handler Publik yang akan kita tes
	s.publicHandler = handler.NewPublicHandler(s.sessionMgr, nil, nil, "")

	// Kegunaan: Menyiapkan Router (Mux) dan mendaftarkan rute API ke dalamnya
	s.mux = http.NewServeMux()
	s.publicHandler.RegisterRoutes(s.mux)
}

// Kegunaan: Titik masuk utama untuk menjalankan suite ini menggunakan 'go test'
func TestCandidateFlowSuite(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}
	suite.Run(t, new(CandidateFlowTestSuite))
}

// ============================================================================
// TEST SCENARIO: Alur Pendaftaran Lengkap (Step 1 -> Step 2)
// Menguji integrasi antara Handler HTTP, Session JWT, dan Database secara
// berurutan layaknya alur pengguna sesungguhnya.
// ============================================================================
func (s *CandidateFlowTestSuite) TestCompleteRegistrationIntegration() {
	ctx := context.Background()
	// Kegunaan: Membuat email unik agar tidak bentrok dengan data test lain
	email := fmt.Sprintf("integrated%d@example.com", time.Now().UnixNano())
	password := "password123"

	// --------------------------------------------------------------------------
	// LANGKAH 1: Simulasi POST Form Pendaftaran Tahap 1 (Pembuatan Akun)
	// --------------------------------------------------------------------------
	s.Run("Step 1: Create Account", func() {
		// Kegunaan: Menyiapkan data form (Email & Password) seperti user mengisi di browser
		form := url.Values{}
		form.Add("email", email)
		form.Add("password", password)
		form.Add("password_confirm", password)

		// Kegunaan: Membuat HTTP Request simulasi POST ke /register/step1
		req := httptest.NewRequest("POST", "/register/step1", strings.NewReader(form.Encode()))
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

		// Kegunaan: Recorder berfungsi sebagai 'penerima' response dari server (pengganti browser)
		rr := httptest.NewRecorder()

		// Kegunaan: Menjalankan logika router dengan request yang kita buat
		s.mux.ServeHTTP(rr, req)

		// Kegunaan: Memastikan server merespon dengan 'Redirect' (Status 302) ke Tahap 2
		s.Equal(http.StatusFound, rr.Code)
		s.Contains(rr.Header().Get("Location"), "step=personal")

		// Kegunaan: Memverifikasi ke database apakah data kandidat benar-benar tersimpan
		candidate, err := model.FindCandidateByEmail(ctx, email)
		s.NoError(err)
		s.NotNil(candidate)
		s.Equal(email, *candidate.Email)
	})

	// --------------------------------------------------------------------------
	// LANGKAH 2: Simulasi Update Data Diri (Membutuhkan Cookie Session/JWT)
	// --------------------------------------------------------------------------
	s.Run("Step 2: Fill Personal Info", func() {
		// Kegunaan: Mencari kandidat yang baru dibuat di langkah sebelumnya
		candidate, _ := model.FindCandidateByEmail(ctx, email)

		// Kegunaan: Membuat Token JWT agar sistem mengenali siapa yang sedang login
		token, _ := s.sessionMgr.CreateCandidateToken(candidate.ID, *candidate.Email, "")

		// Kegunaan: Menyiapkan data form biodata diri
		form := url.Values{}
		form.Add("name", "Integrated Test User")
		form.Add("address", "Jl. Integrasi No 1")
		form.Add("city", "Bogor")
		form.Add("province", "Jawa Barat")

		req := httptest.NewRequest("POST", "/register/step2", strings.NewReader(form.Encode()))
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		// Kegunaan: Memasukkan Cookie Sesi ke dalam request agar server tahu siapa user-nya
		req.AddCookie(&http.Cookie{Name: "session", Value: token})

		rr := httptest.NewRecorder()
		s.mux.ServeHTTP(rr, req)

		// Kegunaan: Memastikan diarahkan ke Tahap 3 (Pendidikan)
		s.Equal(http.StatusFound, rr.Code)
		s.Contains(rr.Header().Get("Location"), "step=education")

		// Kegunaan: Cek database apakah nama sudah terupdate sesuai yang diinput
		updated, _ := model.FindCandidateByID(ctx, candidate.ID)
		s.Equal("Integrated Test User", *updated.Name)
	})
}
