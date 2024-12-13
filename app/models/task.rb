class Task < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :display_color
  belongs_to :display_type
  belongs_to :user

  before_validation :set_default_values
  before_validation :convert_blank_to_nil

  validates :title, presence: true, length: { maximum: 100 } 
  validates :description, presence: true
  validates :due_date, presence: true 
  validates :completed, inclusion: { in: [true, false] } # 完了ステータスはtrueまたはfalseのみ
  validates :display_color_id, numericality: { other_than: 1 , message: "can't be blank"}
  validates :display_type_id, numericality: { other_than: 1 , message: "can't be blank"}

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
  end

  def convert_blank_to_nil
    self.display_color_id = nil if display_color_id == '---'
    self.display_type_id = nil if display_type_id == '---'
  end
end