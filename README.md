# ToDoカレンダー

## アプリケーション概要
このアプリケーションは、タスク管理とカレンダー機能を組み合わせた、シンプルで使いやすいToDoリストです。ユーザーは自分のタスクを作成し、カレンダー上で視覚的に管理することができます。タスクごとにカレンダー上のマーカーの色や形を設定でき、効率的なタスク管理を実現します。

## URL
※デプロイ後に記載予定

## テスト用アカウント
- メールアドレス: test@example.com
- パスワード: password123

## 利用方法
1. トップページからユーザー登録またはログインを行う
2. 「新しいタスクを作成」ボタンをクリックし、タスクの詳細を入力する
3. タスク一覧で作成したタスクを確認し、必要に応じて編集や削除を行う
4. カレンダー表示で、タスクの期限や全体の予定を確認する
5. タスクの完了状態を更新し、進捗を管理する

## アプリケーションを作成した背景
日々のタスク管理に悩む人々、特に視覚的な管理を好む方々のニーズに応えるため、このアプリケーションを開発しました。従来のToDoリストの機能性とカレンダーの視覚的わかりやすさを組み合わせることで、より直感的で効果的なタスク管理を実現することを目指しています。

## 実装した機能についての画像やGIFおよびその説明
1. ユーザー認証機能
   - ユーザーの登録、ログイン、ログアウトが可能
   ※画像を追加予定

2. タスク管理機能
   - タスクの作成、編集、削除が可能
   - タスクごとにカレンダー上のマーカーの色や形を設定可能
   ※画像を追加予定

3. カレンダー表示機能
   - 月別カレンダーでタスクを視覚的に確認可能
   - タスクの期限日に合わせて、設定した色と形のマーカーを表示
   ※画像を追加予定

4. リアルタイムデジタル時計
   - 現在時刻をリアルタイムで表示
   ※画像を追加予定

5. ページネーション機能
   - タスク一覧を6件ずつ表示し、ページ送りが可能
   ※画像を追加予定

## 実装予定の機能
- タスクの検索機能
- タスクのカテゴリー分け機能
- タスクの優先度設定機能
- リマインダー機能（メールやプッシュ通知）

## データベース設計
### users テーブル

| Column             | Type     | Options                   |
| ------------------ | -------- | ------------------------- |
| nickname           | string   | null: false               |
| email              | string   | null: false, unique: true |
| encrypted_password | string   | null: false               |
| created_at         | datetime |                           |
| updated_at         | datetime |                           |

#### Association
- has_many :tasks

### tasks テーブル

| Column           | Type       | Options                        |
| ---------------- | ---------- | ------------------------------ |
| title            | string     | null: false                    |
| description      | text       |                                |
| due_date         | date       | null: false, index: true       |
| completed        | boolean    | null: false, default: false    |
| user             | references | null: false, foreign_key: true |
| display_color_id | integer    | null: false                    |
| display_type_id  | integer    | null: false                    |
| start_time       | datetime   |                                |
| created_at       | datetime   |                                |
| updated_at       | datetime   |                                |

#### Association
- belongs_to :user
- belongs_to_active_hash :display_color
- belongs_to_active_hash :display_type

## 画面遷移図
※画面遷移図を追加予定

## 開発環境
- フロントエンド: HTML, CSS, JavaScript
- バックエンド: Ruby on Rails 7
- データベース: PostgreSQL
- 認証: Devise
- カレンダー機能: simple_calendar gem
- 色と表示タイプの管理: active_hash gem
- バージョン管理: Git, GitHub

## ローカルでの動作方法

