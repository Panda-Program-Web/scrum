package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"go-example/handler"
	"go-example/repository"
	"go-example/usecase"
)

// テスト用のセットアップ
func setupHandler() *handler.EmployeeHandler {
	repo := repository.NewInMemoryEmployeeRepository()
	uc := usecase.NewEmployeeUseCase(repo)
	return handler.NewEmployeeHandler(uc)
}

// Go 1.22 の PathValue を使うため、mux 経由でリクエストを送る
func setupMux(h *handler.EmployeeHandler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /employees", h.List)
	mux.HandleFunc("GET /employees/{id}", h.Get)
	mux.HandleFunc("POST /employees", h.Create)
	mux.HandleFunc("PUT /employees/{id}", h.Update)
	mux.HandleFunc("DELETE /employees/{id}", h.Delete)
	return mux
}

func TestEmployeeHandler_Create(t *testing.T) {
	t.Run("正常: 従業員を作成", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		body := `{"name": "山田 太郎"}`
		req := httptest.NewRequest("POST", "/employees", bytes.NewBufferString(body))
		req.Header.Set("Content-Type", "application/json")
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusCreated {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusCreated)
		}

		var resp map[string]any
		json.NewDecoder(rec.Body).Decode(&resp)

		if resp["name"] != "山田 太郎" {
			t.Errorf("name = %v, want %q", resp["name"], "山田 太郎")
		}
		if resp["id"].(float64) != 1 {
			t.Errorf("id = %v, want 1", resp["id"])
		}
	})

	t.Run("エラー: 不正なJSON", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		body := `{invalid json}`
		req := httptest.NewRequest("POST", "/employees", bytes.NewBufferString(body))
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusBadRequest)
		}
	})

	t.Run("エラー: 名前のフォーマット不正", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		body := `{"name": "山田太郎"}` // スペースなし
		req := httptest.NewRequest("POST", "/employees", bytes.NewBufferString(body))
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusInternalServerError {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusInternalServerError)
		}
	})
}

func TestEmployeeHandler_List(t *testing.T) {
	t.Run("正常: 空のリスト", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		req := httptest.NewRequest("GET", "/employees", nil)
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusOK)
		}

		var resp []any
		json.NewDecoder(rec.Body).Decode(&resp)

		if len(resp) != 0 {
			t.Errorf("length = %d, want 0", len(resp))
		}
	})

	t.Run("正常: 従業員が存在する場合", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		// 事前に従業員を作成
		body := `{"name": "山田 太郎"}`
		createReq := httptest.NewRequest("POST", "/employees", bytes.NewBufferString(body))
		mux.ServeHTTP(httptest.NewRecorder(), createReq)

		// リスト取得
		req := httptest.NewRequest("GET", "/employees", nil)
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)

		var resp []map[string]any
		json.NewDecoder(rec.Body).Decode(&resp)

		if len(resp) != 1 {
			t.Errorf("length = %d, want 1", len(resp))
		}
	})
}

func TestEmployeeHandler_Get(t *testing.T) {
	t.Run("正常: 従業員を取得", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		// 事前に作成
		body := `{"name": "山田 太郎"}`
		createReq := httptest.NewRequest("POST", "/employees", bytes.NewBufferString(body))
		mux.ServeHTTP(httptest.NewRecorder(), createReq)

		// 取得
		req := httptest.NewRequest("GET", "/employees/1", nil)
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusOK)
		}

		var resp map[string]any
		json.NewDecoder(rec.Body).Decode(&resp)

		if resp["name"] != "山田 太郎" {
			t.Errorf("name = %v, want %q", resp["name"], "山田 太郎")
		}
	})

	t.Run("エラー: 存在しない従業員", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		req := httptest.NewRequest("GET", "/employees/999", nil)
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusNotFound {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusNotFound)
		}
	})

	t.Run("エラー: 不正なID", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		req := httptest.NewRequest("GET", "/employees/abc", nil)
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusBadRequest)
		}
	})
}

func TestEmployeeHandler_Update(t *testing.T) {
	t.Run("正常: 従業員を更新", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		// 事前に作成
		createBody := `{"name": "山田 太郎"}`
		createReq := httptest.NewRequest("POST", "/employees", bytes.NewBufferString(createBody))
		mux.ServeHTTP(httptest.NewRecorder(), createReq)

		// 更新
		updateBody := `{"name": "佐藤 次郎"}`
		req := httptest.NewRequest("PUT", "/employees/1", bytes.NewBufferString(updateBody))
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusOK)
		}

		var resp map[string]any
		json.NewDecoder(rec.Body).Decode(&resp)

		if resp["name"] != "佐藤 次郎" {
			t.Errorf("name = %v, want %q", resp["name"], "佐藤 次郎")
		}
	})
}

func TestEmployeeHandler_Delete(t *testing.T) {
	t.Run("正常: 従業員を削除", func(t *testing.T) {
		h := setupHandler()
		mux := setupMux(h)

		// 事前に作成
		body := `{"name": "山田 太郎"}`
		createReq := httptest.NewRequest("POST", "/employees", bytes.NewBufferString(body))
		mux.ServeHTTP(httptest.NewRecorder(), createReq)

		// 削除
		req := httptest.NewRequest("DELETE", "/employees/1", nil)
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusNoContent {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusNoContent)
		}

		// 削除されていることを確認
		getReq := httptest.NewRequest("GET", "/employees/1", nil)
		getRec := httptest.NewRecorder()
		mux.ServeHTTP(getRec, getReq)

		if getRec.Code != http.StatusNotFound {
			t.Errorf("should be deleted, status = %d", getRec.Code)
		}
	})
}
