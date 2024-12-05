class TasksController < ApplicationController
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  def index
    @tasks = Task.all
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today
    @tasks = Task.where(due_date: start_date.beginning_of_month..start_date.end_of_month)
  end

  def new
    @task = Task.new
  end

  def create
    if current_user.nil?
      redirect_to new_user_session_path, alert: 'You must be logged in to create a task.'
    else
      @task = Task.new(task_params)
      @task.user = current_user
      @task.save
    end
  end

  def show
  end

  def edit
  end

  def destroy
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :due_date, :completed, :user_id, :start_time)
  end
end
