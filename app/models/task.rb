class Task < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :display_color
  belongs_to :display_type
  belongs_to :user

  before_validation :set_default_values

  validates :title, presence: true, length: { maximum: 100 } 
  validates :description, presence: true
  validates :due_date, presence: true 
  validates :completed, inclusion: { in: [true, false] } # 完了ステータスはtrueまたはfalseのみ
  validates :display_color_id, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 6 }
  validates :display_type_id, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 4 }

  # スコープ (簡潔に条件付きクエリを定義)
  scope :completed, -> { where(completed: true) } # 完了したタスクを取得
  scope :pending, -> { where(completed: false) } # 未完了のタスクを取得
  scope :due_today, -> { where(due_date: Date.today) } # 本日が期限のタスクを取得

  # インスタンスメソッド (タスクの完了ステータスをトグル)
  def toggle_completion!
    update(completed: !completed) # 完了済みなら未完了に、未完了なら完了済みに更新
  end

  # コールバック (新しいレコードを作成するとき、完了ステータスをデフォルトでfalseに設定)
  private

  # プライベートメソッド
  def set_default_values
    self.completed = false if completed.nil?
    self.display_color_id ||= 1
    self.display_type_id ||= 1
  end

end