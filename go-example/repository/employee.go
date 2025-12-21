package repository

import (
	"sync"

	"go-example/domain"
)

// InMemoryEmployeeRepository はメモリ上で従業員を管理する Repository 実装
// domain.EmployeeRepository インターフェースを「暗黙的に」実装している
type InMemoryEmployeeRepository struct {
	mu        sync.RWMutex       // 並行アクセス対策
	employees map[domain.EmployeeID]*domain.Employee
	nextID    domain.EmployeeID
}

// NewInMemoryEmployeeRepository は InMemoryEmployeeRepository を生成
func NewInMemoryEmployeeRepository() *InMemoryEmployeeRepository {
	return &InMemoryEmployeeRepository{
		employees: make(map[domain.EmployeeID]*domain.Employee),
		nextID:    1,
	}
}

// FindByID は指定IDの従業員を取得
func (r *InMemoryEmployeeRepository) FindByID(id domain.EmployeeID) (*domain.Employee, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	emp, ok := r.employees[id]
	if !ok {
		return nil, domain.ErrEmployeeNotFound
	}
	return emp, nil
}

// FindAll は全従業員を取得
func (r *InMemoryEmployeeRepository) FindAll() ([]*domain.Employee, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	employees := make([]*domain.Employee, 0, len(r.employees))
	for _, emp := range r.employees {
		employees = append(employees, emp)
	}
	return employees, nil
}

// Count は従業員数を返す
func (r *InMemoryEmployeeRepository) Count() (int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return len(r.employees), nil
}

// Save は新しい従業員を保存（ID を採番して返す）
func (r *InMemoryEmployeeRepository) Save(employee *domain.Employee) (*domain.Employee, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	// ID を採番
	saved := &domain.Employee{
		ID:   r.nextID,
		Name: employee.Name,
	}
	r.employees[r.nextID] = saved
	r.nextID++

	return saved, nil
}

// Update は既存の従業員を更新
func (r *InMemoryEmployeeRepository) Update(employee *domain.Employee) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.employees[employee.ID]; !ok {
		return domain.ErrEmployeeNotFound
	}

	r.employees[employee.ID] = employee
	return nil
}

// Delete は従業員を削除
func (r *InMemoryEmployeeRepository) Delete(id domain.EmployeeID) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.employees[id]; !ok {
		return domain.ErrEmployeeNotFound
	}

	delete(r.employees, id)
	return nil
}

// コンパイル時にインターフェースを満たしているかチェック
var _ domain.EmployeeRepository = (*InMemoryEmployeeRepository)(nil)
