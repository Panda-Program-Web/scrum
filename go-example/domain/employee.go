package domain

import (
	"errors"
	"strings"
)

// ===== Value Objects =====

// EmployeeID は従業員IDの値オブジェクト
type EmployeeID int

// EmployeeName は従業員名の値オブジェクト（姓・名を持つ）
type EmployeeName struct {
	FirstName  string
	FamilyName string
}

// NewEmployeeNameFromString は "山田 太郎" のような文字列から EmployeeName を生成
func NewEmployeeNameFromString(fullName string) (EmployeeName, error) {
	if !strings.Contains(fullName, " ") {
		return EmployeeName{}, errors.New("社員名は姓名を半角スペースで区切ってください")
	}

	parts := strings.SplitN(fullName, " ", 2)
	return EmployeeName{
		FamilyName: parts[0],
		FirstName:  parts[1],
	}, nil
}

// FullName は "姓 名" のフルネームを返す
func (n EmployeeName) FullName() string {
	return n.FamilyName + " " + n.FirstName
}

// ===== Entity =====

// Employee は従業員エンティティ
type Employee struct {
	ID   EmployeeID
	Name EmployeeName
}

// NewEmployee は新しい Employee を生成（ID=0 は未保存を意味する）
func NewEmployee(name EmployeeName) *Employee {
	return &Employee{
		ID:   0,
		Name: name,
	}
}

// UpdateName は名前を更新した新しい Employee を返す（immutable）
func (e *Employee) UpdateName(name EmployeeName) *Employee {
	return &Employee{
		ID:   e.ID,
		Name: name,
	}
}

// ===== Repository Interface (Port) =====

// EmployeeRepository は従業員の永続化インターフェース
// Go では interface は暗黙的に実装される（duck typing）
type EmployeeRepository interface {
	FindByID(id EmployeeID) (*Employee, error)
	FindAll() ([]*Employee, error)
	Count() (int, error)
	Save(employee *Employee) (*Employee, error)
	Update(employee *Employee) error
	Delete(id EmployeeID) error
}

// ===== Domain Errors =====

var (
	ErrEmployeeNotFound = errors.New("従業員が見つかりません")
	ErrEmployeeLimit    = errors.New("登録できる従業員数の上限に達しました。登録可能な人数は50名以下です")
)
