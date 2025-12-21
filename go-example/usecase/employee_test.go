package usecase_test

import (
	"context"
	"testing"

	"go-example/domain"
	"go-example/usecase"
)

// ===== Mock Repository =====
// テスト用のモック。domain.EmployeeRepository を満たす

type mockEmployeeRepository struct {
	employees map[domain.EmployeeID]*domain.Employee
	nextID    domain.EmployeeID
	// テスト用のフック
	countOverride *int
}

func newMockRepo() *mockEmployeeRepository {
	return &mockEmployeeRepository{
		employees: make(map[domain.EmployeeID]*domain.Employee),
		nextID:    1,
	}
}

func (m *mockEmployeeRepository) FindByID(id domain.EmployeeID) (*domain.Employee, error) {
	emp, ok := m.employees[id]
	if !ok {
		return nil, domain.ErrEmployeeNotFound
	}
	return emp, nil
}

func (m *mockEmployeeRepository) FindAll() ([]*domain.Employee, error) {
	result := make([]*domain.Employee, 0, len(m.employees))
	for _, emp := range m.employees {
		result = append(result, emp)
	}
	return result, nil
}

func (m *mockEmployeeRepository) Count() (int, error) {
	if m.countOverride != nil {
		return *m.countOverride, nil
	}
	return len(m.employees), nil
}

func (m *mockEmployeeRepository) Save(emp *domain.Employee) (*domain.Employee, error) {
	saved := &domain.Employee{ID: m.nextID, Name: emp.Name}
	m.employees[m.nextID] = saved
	m.nextID++
	return saved, nil
}

func (m *mockEmployeeRepository) Update(emp *domain.Employee) error {
	if _, ok := m.employees[emp.ID]; !ok {
		return domain.ErrEmployeeNotFound
	}
	m.employees[emp.ID] = emp
	return nil
}

func (m *mockEmployeeRepository) Delete(id domain.EmployeeID) error {
	if _, ok := m.employees[id]; !ok {
		return domain.ErrEmployeeNotFound
	}
	delete(m.employees, id)
	return nil
}

// ===== Tests =====

func TestEmployeeUseCase_Create(t *testing.T) {
	t.Run("正常: 従業員を作成できる", func(t *testing.T) {
		repo := newMockRepo()
		uc := usecase.NewEmployeeUseCase(repo)
		ctx := context.Background()

		output, err := uc.Create(ctx, usecase.CreateEmployeeInput{
			Name: "山田 太郎",
		})

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if output.ID != 1 {
			t.Errorf("ID = %d, want 1", output.ID)
		}
		if output.Name != "山田 太郎" {
			t.Errorf("Name = %q, want %q", output.Name, "山田 太郎")
		}
	})

	t.Run("エラー: 名前のフォーマットが不正", func(t *testing.T) {
		repo := newMockRepo()
		uc := usecase.NewEmployeeUseCase(repo)
		ctx := context.Background()

		_, err := uc.Create(ctx, usecase.CreateEmployeeInput{
			Name: "山田太郎", // スペースなし
		})

		if err == nil {
			t.Error("expected error but got nil")
		}
	})

	t.Run("エラー: 50人制限に達している", func(t *testing.T) {
		repo := newMockRepo()
		count := 50
		repo.countOverride = &count // 50人いる状態をシミュレート

		uc := usecase.NewEmployeeUseCase(repo)
		ctx := context.Background()

		_, err := uc.Create(ctx, usecase.CreateEmployeeInput{
			Name: "山田 太郎",
		})

		if err != domain.ErrEmployeeLimit {
			t.Errorf("error = %v, want %v", err, domain.ErrEmployeeLimit)
		}
	})
}

func TestEmployeeUseCase_Edit(t *testing.T) {
	t.Run("正常: 従業員名を更新できる", func(t *testing.T) {
		repo := newMockRepo()
		// 事前に従業員を作成
		repo.Save(&domain.Employee{
			Name: domain.EmployeeName{FirstName: "太郎", FamilyName: "山田"},
		})

		uc := usecase.NewEmployeeUseCase(repo)
		ctx := context.Background()

		output, err := uc.Edit(ctx, usecase.EditEmployeeInput{
			ID:      1,
			NewName: "佐藤 次郎",
		})

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if output.Name != "佐藤 次郎" {
			t.Errorf("Name = %q, want %q", output.Name, "佐藤 次郎")
		}
	})

	t.Run("エラー: 存在しない従業員", func(t *testing.T) {
		repo := newMockRepo()
		uc := usecase.NewEmployeeUseCase(repo)
		ctx := context.Background()

		_, err := uc.Edit(ctx, usecase.EditEmployeeInput{
			ID:      999,
			NewName: "佐藤 次郎",
		})

		if err != domain.ErrEmployeeNotFound {
			t.Errorf("error = %v, want %v", err, domain.ErrEmployeeNotFound)
		}
	})
}

func TestEmployeeUseCase_Delete(t *testing.T) {
	t.Run("正常: 従業員を削除できる", func(t *testing.T) {
		repo := newMockRepo()
		repo.Save(&domain.Employee{
			Name: domain.EmployeeName{FirstName: "太郎", FamilyName: "山田"},
		})

		uc := usecase.NewEmployeeUseCase(repo)
		ctx := context.Background()

		err := uc.Delete(ctx, 1)

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		// 削除されていることを確認
		_, err = repo.FindByID(1)
		if err != domain.ErrEmployeeNotFound {
			t.Error("employee should be deleted")
		}
	})

	t.Run("エラー: 存在しない従業員", func(t *testing.T) {
		repo := newMockRepo()
		uc := usecase.NewEmployeeUseCase(repo)
		ctx := context.Background()

		err := uc.Delete(ctx, 999)

		if err != domain.ErrEmployeeNotFound {
			t.Errorf("error = %v, want %v", err, domain.ErrEmployeeNotFound)
		}
	})
}
