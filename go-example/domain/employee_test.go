package domain_test

import (
	"testing"

	"go-example/domain"
)

func TestNewEmployeeNameFromString(t *testing.T) {
	tests := []struct {
		name      string
		input     string
		wantFirst string
		wantLast  string
		wantErr   bool
	}{
		{
			name:      "正常: 姓名をスペースで分割",
			input:     "山田 太郎",
			wantFirst: "太郎",
			wantLast:  "山田",
			wantErr:   false,
		},
		{
			name:      "正常: ミドルネームあり",
			input:     "田中 一郎 次郎",
			wantFirst: "一郎 次郎",
			wantLast:  "田中",
			wantErr:   false,
		},
		{
			name:    "エラー: スペースなし",
			input:   "山田太郎",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := domain.NewEmployeeNameFromString(tt.input)

			if tt.wantErr {
				if err == nil {
					t.Error("expected error but got nil")
				}
				return
			}

			if err != nil {
				t.Errorf("unexpected error: %v", err)
				return
			}

			if got.FirstName != tt.wantFirst {
				t.Errorf("FirstName = %q, want %q", got.FirstName, tt.wantFirst)
			}
			if got.FamilyName != tt.wantLast {
				t.Errorf("FamilyName = %q, want %q", got.FamilyName, tt.wantLast)
			}
		})
	}
}

func TestEmployeeName_FullName(t *testing.T) {
	name := domain.EmployeeName{
		FirstName:  "太郎",
		FamilyName: "山田",
	}

	got := name.FullName()
	want := "山田 太郎"

	if got != want {
		t.Errorf("FullName() = %q, want %q", got, want)
	}
}

func TestEmployee_UpdateName(t *testing.T) {
	// 元の従業員
	original := &domain.Employee{
		ID:   domain.EmployeeID(1),
		Name: domain.EmployeeName{FirstName: "太郎", FamilyName: "山田"},
	}

	// 新しい名前で更新
	newName := domain.EmployeeName{FirstName: "次郎", FamilyName: "佐藤"}
	updated := original.UpdateName(newName)

	// 元のインスタンスは変更されていないこと（immutable）
	if original.Name.FirstName != "太郎" {
		t.Error("original should not be modified")
	}

	// 新しいインスタンスに更新が反映されていること
	if updated.Name.FirstName != "次郎" {
		t.Errorf("updated.Name.FirstName = %q, want %q", updated.Name.FirstName, "次郎")
	}

	// ID は保持されること
	if updated.ID != original.ID {
		t.Error("ID should be preserved")
	}
}
