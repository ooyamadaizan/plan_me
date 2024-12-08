class Task < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 100 } 
  validates :description, presence: true
  validates :due_date, presence: true 
  validates :completed, inclusion: { in: [true, false] } # 完了ステータスはtrueまたはfalseのみ

  # スコープ (簡潔に条件付きクエリを定義)
  scope :completed, -> { where(completed: true) } # 完了したタスクを取得
  scope :pending, -> { where(completed: false) } # 未完了のタスクを取得
  scope :due_today, -> { where(due_date: Date.today) } # 本日が期限のタスクを取得

  # インスタンスメソッド (タスクの完了ステータスをトグル)
  def toggle_completion!
    update(completed: !completed) # 完了済みなら未完了に、未完了なら完了済みに更新
  end

  # コールバック (新しいレコードを作成するとき、完了ステータスをデフォルトでfalseに設定)
  after_initialize :set_default_completed, if: :new_record?

  private

  # プライベートメソッド (初期値を設定する処理)
  def set_default_completed
    self.completed ||= false # completedがnilの場合にfalseを設定
  end
end