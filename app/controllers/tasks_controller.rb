class TasksController < ApplicationController
  # ユーザーがログインしていることを確認するフィルタ
  before_action :authenticate_user!

  # タスクの一覧を表示するアクション
  def index
    # 現在のユーザーのタスクを作成日時の降順で6件取得
    @tasks = current_user.tasks.order(created_at: :desc).limit(6)
    # 新しいタスクを作成するための空のオブジェクト
    @task = Task.new
    # パラメータに開始日があればそれを使用、なければ今日の日付を使用
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today
    # カレンダーに表示する当月のタスクを取得
    @calendar_tasks = current_user.tasks.where(due_date: start_date.beginning_of_month..start_date.end_of_month)
  end

  # 新しいタスクを作成するアクション
  def create
    # 現在のユーザーのタスクを作成
    @task = current_user.tasks.build(task_params)
    if @task.save
      # タスク作成成功時、最新の6件を部分テンプレートで返す
      @tasks = current_user.tasks.order(created_at: :desc).limit(6)
      render partial: 'shared/task', collection: @tasks
    else
      # 作成失敗時、エラーメッセージをJSON形式で返す
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # タスクを更新するアクション
  def update
    # 更新対象のタスクを取得
    @task = current_user.tasks.find(params[:id])
    if @task.update(task_params)
      # 更新成功時、HTTPステータスコード200を返す
      render json: { success: true, message: "Task updated successfully" }, status: :ok
    else
      # 更新失敗時、エラーメッセージをJSON形式で返す
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task = Task.find(params[:id])

    if @task.destroy
      render json: { message: 'Task successfully deleted' }, status: :ok
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # タスクの並び順を再取得するアクション
  def reorder
    # ページネーションに対応して、指定されたオフセットから6件取得
    @tasks = current_user.tasks.order(created_at: :desc).offset(params[:offset]).limit(6)
    # 部分テンプレートでタスク一覧を返す
    render partial: 'shared/task', collection: @tasks
  end

  private

  # タスクのパラメータを許可するメソッド
  def task_params
    # title, description, due_date, completed のみ許可
    params.require(:task).permit(:title, :description, :due_date, :completed)
  end
end