package usecase

import (
	"context"

	"go-example/domain"
)

// ===== Command (Input DTO) =====

// CreateEmployeeInput は従業員作成のリクエスト
type CreateEmployeeInput struct {
	Name string // "姓 名" 形式
}

// EditEmployeeInput は従業員編集のリクエスト
type EditEmployeeInput struct {
	ID      int
	NewName string
}

// ===== Output DTO =====

// EmployeeOutput は従業員のレスポンス用 DTO
type EmployeeOutput struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// ===== UseCase =====

// EmployeeUseCase は従業員に関するビジネスロジックを実装
type EmployeeUseCase struct {
	repo domain.EmployeeRepository
}

// NewEmployeeUseCase は EmployeeUseCase を生成
// Go では依存性注入はコンストラクタ関数で行う
func NewEmployeeUseCase(repo domain.EmployeeRepository) *EmployeeUseCase {
	return &EmployeeUseCase{repo: repo}
}

// Create は新しい従業員を登録する
func (uc *EmployeeUseCase) Create(ctx context.Context, input CreateEmployeeInput) (*EmployeeOutput, error) {
	// ビジネスルール: 従業員は50人まで
	count, err := uc.repo.Count()
	if err != nil {
		return nil, err
	}
	if count >= 50 {
		return nil, domain.ErrEmployeeLimit
	}

	// Value Object を生成（バリデーション含む）
	name, err := domain.NewEmployeeNameFromString(input.Name)
	if err != nil {
		return nil, err
	}

	// Entity を生成して保存
	employee := domain.NewEmployee(name)
	saved, err := uc.repo.Save(employee)
	if err != nil {
		return nil, err
	}

	// Output DTO に変換して返す
	return &EmployeeOutput{
		ID:   int(saved.ID),
		Name: saved.Name.FullName(),
	}, nil
}

// FindAll は全従業員を取得する
func (uc *EmployeeUseCase) FindAll(ctx context.Context) ([]*EmployeeOutput, error) {
	employees, err := uc.repo.FindAll()
	if err != nil {
		return nil, err
	}

	// Domain Entity -> Output DTO に変換
	outputs := make([]*EmployeeOutput, len(employees))
	for i, emp := range employees {
		outputs[i] = &EmployeeOutput{
			ID:   int(emp.ID),
			Name: emp.Name.FullName(),
		}
	}
	return outputs, nil
}

// FindByID は指定IDの従業員を取得する
func (uc *EmployeeUseCase) FindByID(ctx context.Context, id int) (*EmployeeOutput, error) {
	employee, err := uc.repo.FindByID(domain.EmployeeID(id))
	if err != nil {
		return nil, err
	}

	return &EmployeeOutput{
		ID:   int(employee.ID),
		Name: employee.Name.FullName(),
	}, nil
}

// Edit は従業員名を更新する
func (uc *EmployeeUseCase) Edit(ctx context.Context, input EditEmployeeInput) (*EmployeeOutput, error) {
	// 既存の従業員を取得
	employee, err := uc.repo.FindByID(domain.EmployeeID(input.ID))
	if err != nil {
		return nil, err
	}

	// 新しい名前の Value Object を生成
	newName, err := domain.NewEmployeeNameFromString(input.NewName)
	if err != nil {
		return nil, err
	}

	// Entity を更新（immutable に新しいインスタンスを作成）
	updated := employee.UpdateName(newName)
	if err := uc.repo.Update(updated); err != nil {
		return nil, err
	}

	return &EmployeeOutput{
		ID:   int(updated.ID),
		Name: updated.Name.FullName(),
	}, nil
}

// Delete は従業員を削除する
func (uc *EmployeeUseCase) Delete(ctx context.Context, id int) error {
	// 存在確認
	_, err := uc.repo.FindByID(domain.EmployeeID(id))
	if err != nil {
		return err
	}

	return uc.repo.Delete(domain.EmployeeID(id))
}
