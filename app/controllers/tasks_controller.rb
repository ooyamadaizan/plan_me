class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
    @tasks = current_user.tasks.order(created_at: :desc).limit(6)
    @task = Task.new
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today
    @calendar_tasks = current_user.tasks.where(due_date: start_date.beginning_of_month..start_date.end_of_month)
  end

  def create
    @task = current_user.tasks.build(task_params)
    if @task.save
      @tasks = current_user.tasks.order(created_at: :desc).limit(6)
      render partial: 'shared/task', collection: @tasks
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @task = current_user.tasks.find(params[:id])
    if @task.update(task_params)
      head :ok
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def reorder
    @tasks = current_user.tasks.order(created_at: :desc).offset(params[:offset]).limit(6)
    render partial: 'shared/task', collection: @tasks
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :due_date, :completed)
  end
end
