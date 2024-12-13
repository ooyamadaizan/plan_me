# plan_me

## アプリケーション概要
このアプリケーションは、タスク管理とカレンダー機能を組み合わせた、シンプルで使いやすいToDoリストです。ユーザーは自分のタスクを作成し、カレンダー上で視覚的に管理することができます。タスクごとに色分けや表示タイプを設定でき、効率的なタスク管理を実現します。

## URL
現在随時更新中のモノですが本番環境も入れておきます。
https://plan-me.onrender.com

## Basic認証
- ID: admin 
- パスワード: 4286

## テスト用アカウント
- メールアドレス: test@test.com
- パスワード: 123456789

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

2. タスク管理機能
   - タスクの作成、編集、削除が可能
   - タスクごとに色分けや表示タイプを設定可能

3. カレンダー表示機能
   - 月別カレンダーでタスクを視覚的に確認可能
   - タスクの期限日に合わせて、設定した色とタイプのマーカーを表示

4. リアルタイムデジタル時計
   - 現在時刻をリアルタイムで表示

5. ページネーション機能
   - タスク一覧を6件ずつ表示し、ページ送りが可能

## 実装予定の機能
- タスクの検索機能

## データベース設計
- ER図を追加予定

## 画面遷移図
- 画面遷移図を追加予定

## 開発環境
- フロントエンド: HTML, CSS, JavaScript
- バックエンド: Ruby on Rails 7
- データベース: PostgreSQL
- 認証: Devise
- カレンダー機能: simple_calendar gem
- バージョン管理: Git, GitHub

javascriptを実装して行ったこと

## 主な実装内容

### インライン編集機能
- タスクタイトル、説明、期限を `contenteditable="true"` を付与した HTML 要素（例：`<h3 class="task-title" contenteditable="true">`）でインライン編集可能にする。
- ユーザーが編集を終えて要素からフォーカスが外れる（`blur`イベントが発生）と、`fetch` API を用いてサーバーへ `PATCH` リクエストを非同期送信。
- サーバー側で更新が成功すれば、クライアント側は即座に編集内容を反映。

### 非同期通信 (fetch API) による更新
- タスクの状態変更（作成、更新、削除、完了ステータス変更）を `fetch` API で非同期処理。
- `method: 'PATCH'` や `POST`, `DELETE` などを使用し、JSON形式でデータ送信。
- レスポンスを受信後、`innerHTML` の更新や部分HTMLの差し替えで画面をリフレッシュ。

### 完了チェックボックスの状態更新
- チェックボックスの `change` イベントで、タスクの完了状態を `fetch` API で更新（`PATCH`リクエスト）。
- 成功時に通知（`showNotification('成功メッセージ', 'success')`）を表示し、対応するタスクアイテムに `completed` クラスを付加/除去。

### 削除ボタンの有効化/無効化
- タスクが未完了の場合は削除ボタンを `disabled` 状態にし、完了済みなら有効化。
- チェックボックスの状態変化に応じて、削除ボタンの有効/無効を切り替える。

### 通知メッセージの表示
- `showNotification(message, type)` 関数で、更新結果に応じて画面右下に一時的な通知を表示。
- 成功時には緑色、失敗時には赤色など明確なフィードバックをユーザーに提供。

## ローカルでの動作方法

