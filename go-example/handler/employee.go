package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"go-example/domain"
	"go-example/usecase"
)

// EmployeeHandler は HTTP リクエストを処理する（Presenter/Controller 的な役割）
type EmployeeHandler struct {
	uc *usecase.EmployeeUseCase
}

// NewEmployeeHandler は EmployeeHandler を生成
func NewEmployeeHandler(uc *usecase.EmployeeUseCase) *EmployeeHandler {
	return &EmployeeHandler{uc: uc}
}

// ===== Request/Response 構造体 =====

type createEmployeeRequest struct {
	Name string `json:"name"`
}

type errorResponse struct {
	Error string `json:"error"`
}

// ===== Helper 関数 =====

// JSON レスポンスを返す
func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// エラーレスポンスを返す
func writeError(w http.ResponseWriter, status int, err error) {
	writeJSON(w, status, errorResponse{Error: err.Error()})
}

// ===== Handler Methods =====

// List は GET /employees - 全従業員を取得
func (h *EmployeeHandler) List(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	employees, err := h.uc.FindAll(ctx)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, employees)
}

// Get は GET /employees/{id} - 指定IDの従業員を取得
func (h *EmployeeHandler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// URL から ID を取得（Go 1.22+ の PathValue を使用）
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, errors.New("invalid id"))
		return
	}

	employee, err := h.uc.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, domain.ErrEmployeeNotFound) {
			writeError(w, http.StatusNotFound, err)
			return
		}
		writeError(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, employee)
}

// Create は POST /employees - 新規従業員を作成
func (h *EmployeeHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// リクエストボディをパース
	var req createEmployeeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, errors.New("invalid request body"))
		return
	}

	// UseCase を呼び出し
	employee, err := h.uc.Create(ctx, usecase.CreateEmployeeInput{
		Name: req.Name,
	})
	if err != nil {
		if errors.Is(err, domain.ErrEmployeeLimit) {
			writeError(w, http.StatusBadRequest, err)
			return
		}
		writeError(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusCreated, employee)
}

// Update は PUT /employees/{id} - 従業員情報を更新
func (h *EmployeeHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, errors.New("invalid id"))
		return
	}

	var req createEmployeeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, errors.New("invalid request body"))
		return
	}

	employee, err := h.uc.Edit(ctx, usecase.EditEmployeeInput{
		ID:      id,
		NewName: req.Name,
	})
	if err != nil {
		if errors.Is(err, domain.ErrEmployeeNotFound) {
			writeError(w, http.StatusNotFound, err)
			return
		}
		writeError(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, employee)
}

// Delete は DELETE /employees/{id} - 従業員を削除
func (h *EmployeeHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeError(w, http.StatusBadRequest, errors.New("invalid id"))
		return
	}

	if err := h.uc.Delete(ctx, id); err != nil {
		if errors.Is(err, domain.ErrEmployeeNotFound) {
			writeError(w, http.StatusNotFound, err)
			return
		}
		writeError(w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
