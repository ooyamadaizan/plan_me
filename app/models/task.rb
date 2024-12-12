class Task < ApplicationRecord
  belongs_to :user
  before_validation :set_default_values

  validates :title, presence: true, length: { maximum: 100 } 
  validates :description, presence: true
  validates :due_date, presence: true 
  validates :completed, inclusion: { in: [true, false] } # 完了ステータスはtrueまたはfalseのみ
  validates :display_color, presence: true
  validates :display_type, presence: true

  # スコープ (簡潔に条件付きクエリを定義)
  scope :completed, -> { where(completed: true) } # 完了したタスクを取得
  scope :pending, -> { where(completed: false) } # 未完了のタスクを取得
  scope :due_today, -> { where(due_date: Date.today) } # 本日が期限のタスクを取得

  DISPLAY_COLORS = %w[red blue green yellow purple orange].freeze
  DISPLAY_TYPES = %w[circle square triangle star].freeze
  # インスタンスメソッド (タスクの完了ステータスをトグル)
  def toggle_completion!
    update(completed: !completed) # 完了済みなら未完了に、未完了なら完了済みに更新
  end

  # コールバック (新しいレコードを作成するとき、完了ステータスをデフォルトでfalseに設定)
  private

  # プライベートメソッド
  def set_default_values
    self.completed = false if completed.nil?
    self.display_color ||= DISPLAY_COLORS.first
    self.display_type ||= DISPLAY_TYPES.first
  end
end