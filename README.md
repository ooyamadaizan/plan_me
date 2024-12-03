# ToDoカレンダーアプリ

## 概要
このアプリケーションは、タスク管理とカレンダー機能を組み合わせた、シンプルで使いやすいToDoリストです。ユーザーは自分のタスクを作成し、カレンダー上で視覚的に管理することができます。

## 主な機能
1. ユーザー認証
   - ログイン/ログアウト機能
   - ユーザー登録機能

2. タスク管理
   - タスクの作成、読み取り、更新、削除（CRUD）
   - タスクへの締切日の設定

3. カレンダー表示
   - 月別カレンダーでのタスク表示
   - タスクの締切日をカレンダーに反映

4. デジタル時計（拡張機能）
   - リアルタイムで現在時刻を表示

## 技術スタック
- Ruby on Rails
- PostgreSQL
- Devise（ユーザー認証）
- Bootstrap（UIフレームワーク）
- JavaScript（デジタル時計機能）

## エンティティ

### User（ユーザー）
- id: integer
- email: string
- encrypted_password: string
- created_at: datetime
- updated_at: datetime

### Task（タスク）
- id: integer
- title: string
- description: text
- due_date: date
- completed: boolean
- user_id: integer (外部キー)
- created_at: datetime
- updated_at: datetime

## セットアップ手順
1. リポジトリをクローン