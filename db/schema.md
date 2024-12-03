## users テーブル

| Column             | Type     | Options                   |
| ------------------ | -------- | ------------------------- |
| email              | string   | null: false, unique: true |
| encrypted_password | string   | null: false               |
| created_at         | datetime |                           |
| updated_at         | datetime |                           |

### Association

- has_many :tasks

## tasks テーブル

| Column      | Type       | Options                        |
| ----------- | ---------- | ------------------------------ |
| title       | string     | null: false                    |
| description | text       | null: false                    |
| due_date    | date       | null: false, index: true       |
| completed   | boolean    | null: false, default: false    |
| created_at  | datetime   |                                |
| updated_at  | datetime   |                                |
| user        | references | null: false, foreign_key: true |

### Association

- belongs_to :user

### Indexes

- add_index :tasks, :user_id
- add_index :tasks, :due_date