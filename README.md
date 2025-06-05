# scrum

このレポジトリは、スクラムのチームを管理するアプリケーションです。Web からも CLI からも動かせます。

```mermaid
flowchart TD
    %% UI Layer
    subgraph "User Interfaces"
        CLI["CLI Application"]:::ui
        Web["Web Application"]:::ui
    end

    %% Application Layer
    subgraph "Application Layer"
        UC["Use-Case Layer"]:::app
    end

    %% Domain Layer
    subgraph "Core Domain"
        Core["Core Domain Layer"]:::domain
    end

    %% Infrastructure Layer
    subgraph "Infrastructure"
        Repo["Adapters/Repositories"]:::infra
    end

    %% Connections
    CLI -->|"command_call"| UC
    Web -->|"web_query"| UC
    UC -->|"business_logic"| Core
    UC -->|"persist_data"| Repo
    Repo -->|"data_access"| Core

    %% Click Events
    click CLI "https://github.com/kushibikimashu/scrum/tree/main/apps/cli"
    click Web "https://github.com/kushibikimashu/scrum/tree/main/apps/web"
    click Core "https://github.com/kushibikimashu/scrum/tree/main/packages/core"
    click UC "https://github.com/kushibikimashu/scrum/tree/main/packages/use-case"
    click Repo "https://github.com/kushibikimashu/scrum/tree/main/packages/use-case/src/gateway"

    %% Styles
    classDef ui fill:#a6cee3,stroke:#1f78b4,stroke-width:2px;
    classDef app fill:#b2df8a,stroke:#33a02c,stroke-width:2px;
    classDef domain fill:#fb9a99,stroke:#e31a1c,stroke-width:2px;
    classDef infra fill:#fdbf6f,stroke:#ff7f00,stroke-width:2px;
```

## Quick Start

アプリケーションを動かす事前準備をします。

```
$ pnpm install
$ pnpm build
```

### CLI

CLI は `pnpm scrum [command]` で動かせます。

```
$ cd apps/cli/
$ pnpm scrum help
Usage: index [options] [command]

Options:
  -h, --help              display help for command

Commands:
  init                    最初の設定をします
  add-employee [options]  社員を追加します。 -m, --multiple 複数の社員を追加します
  edit-employee           社員の名前を変更します
  remove-employee         社員を削除します
  create-team             スクラムチームを作成します
  list-team               スクラムチームのメンバーを表示します
  edit-team [options]     スクラムチームのPOかSMを変更します。-po, --product-owner | -sm, --scrum-master
  disband-team            スクラムチームを解散します
  add-developer           スクラムチームの開発者を追加します
  remove-developer        スクラムチームから開発者を除外します
  help [command]          display help for command
```

DB を作成し、社員を追加してください。

```
$ pnpm scrum init
最初の設定を開始します
? 開発するプロダクトの名前は？ sample
? プロジェクト名は？ sample-project
初期設定を完了しました
```

```
$ pnpm scrum add-employee
? スクラムチームに参加する社員の名前は？（姓名は半角スペース区切り） foo bar
社員を登録しました: foo bar
```

社員を2名以上登録すると、`create-team` コマンドでスクラムチームを作成できます。

### API

Hono を使った API サーバーでも同じユースケースを利用できます。
各エンドポイントでは zod を用いてリクエストをバリデートしています。

```bash
$ cd apps/api/
$ pnpm build && pnpm start
```

### Web

> [!NOTE]  
> `db.json`が root にあれば、このファイルを削除してください。
> 削除しなくても以下のコマンドは実行でき、アプリケーションも問題なく動作します。
> ただ、以下の説明は db.json がない状態を想定した説明になっていますのでご注意ください。

Next.js を開発者モードで動かします。

```
$ cd apps/web/
$ pnpm next:dev
```

http://localhost:3000 にアクセスすると、以下の画面が表示されます。

![image](./docs/top-page.png)

プロジェクト名とプロダクト名を送信すると以下の画面に遷移します。

![image](./docs/employee-page.png)

社員を2名以上登録して、サイドメニューのスクラムチームのページを見たり、遊んでみてください。
