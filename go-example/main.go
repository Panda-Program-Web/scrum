package main

import (
	"fmt"
	"log"
	"net/http"

	"go-example/handler"
	"go-example/repository"
	"go-example/usecase"
)

func main() {
	// ===== 依存性の組み立て（Dependency Injection）=====
	//
	// 外側から順に組み立てる:
	//   Repository (インフラ層)
	//     -> UseCase (アプリケーション層)
	//       -> Handler (プレゼンテーション層)

	// 1. Repository を生成（データの永続化を担当）
	employeeRepo := repository.NewInMemoryEmployeeRepository()

	// 2. UseCase を生成（ビジネスロジックを担当）
	//    Repository を注入
	employeeUC := usecase.NewEmployeeUseCase(employeeRepo)

	// 3. Handler を生成（HTTP リクエスト/レスポンスを担当）
	//    UseCase を注入
	employeeHandler := handler.NewEmployeeHandler(employeeUC)

	// ===== ルーティング設定 =====
	mux := http.NewServeMux()

	// RESTful なエンドポイント
	mux.HandleFunc("GET /employees", employeeHandler.List)
	mux.HandleFunc("GET /employees/{id}", employeeHandler.Get)
	mux.HandleFunc("POST /employees", employeeHandler.Create)
	mux.HandleFunc("PUT /employees/{id}", employeeHandler.Update)
	mux.HandleFunc("DELETE /employees/{id}", employeeHandler.Delete)

	// ===== サーバー起動 =====
	addr := ":8080"
	fmt.Printf("Server starting on http://localhost%s\n", addr)
	fmt.Println("Endpoints:")
	fmt.Println("  GET    /employees      - 全従業員取得")
	fmt.Println("  GET    /employees/{id} - 従業員取得")
	fmt.Println("  POST   /employees      - 従業員作成")
	fmt.Println("  PUT    /employees/{id} - 従業員更新")
	fmt.Println("  DELETE /employees/{id} - 従業員削除")

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

/*
===== リクエストからレスポンスまでの流れ =====

例: POST /employees で新しい従業員を作成する場合

1. HTTP Request が来る
   POST /employees
   Body: {"name": "山田 太郎"}
         ↓
2. Handler (handler/employee.go)
   - JSON をパース → createEmployeeRequest{Name: "山田 太郎"}
   - UseCase の入力形式に変換 → CreateEmployeeInput{Name: "山田 太郎"}
   - UseCase を呼び出す
         ↓
3. UseCase (usecase/employee.go)
   - ビジネスルールをチェック（従業員50人制限）
   - Value Object を生成: NewEmployeeNameFromString("山田 太郎")
     → EmployeeName{FamilyName: "山田", FirstName: "太郎"}
   - Entity を生成: NewEmployee(name)
     → Employee{ID: 0, Name: ...}
   - Repository に保存を依頼
         ↓
4. Repository (repository/employee.go)
   - ID を採番（1, 2, 3...）
   - メモリ（map）に保存
   - 保存された Employee を返す
         ↓
3. UseCase（戻り）
   - Entity から Output DTO に変換
     → EmployeeOutput{ID: 1, Name: "山田 太郎"}
   - Handler に返す
         ↓
2. Handler（戻り）
   - DTO を JSON に変換
   - HTTP Response を返す
         ↓
1. HTTP Response
   Status: 201 Created
   Body: {"id": 1, "name": "山田 太郎"}


===== 依存関係の方向 =====

  [HTTP Request]
       ↓
  +----------+
  | Handler  |  ← net/http に依存
  +----------+
       ↓ 呼び出し
  +----------+
  | UseCase  |  ← domain に依存（interface 経由）
  +----------+
       ↓ interface 経由
  +------------+
  | Repository |  ← domain に依存
  +------------+
       ↓
  +----------+
  | Domain   |  ← 何にも依存しない（最も内側）
  +----------+

ポイント:
- Domain は何にも依存しない
- UseCase は Domain の interface に依存
- Repository は Domain の interface を実装
- Handler は UseCase を呼び出すだけ

これにより:
- Repository の実装を差し替えられる（InMemory → PostgreSQL など）
- テストで Mock を注入できる
- 各層を独立してテスト可能
*/
