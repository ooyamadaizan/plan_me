require 'rails_helper'

RSpec.describe Task, type: :model do
  before do
    @user = FactoryBot.create(:user)
    sleep 0.05
    @task = FactoryBot.build(:task, user: @user)
  end

  describe 'バリデーションのテスト' do
    context '登録できる場合' do
      it 'すべての属性が正しい場合は登録できる' do
        expect(@task).to be_valid
      end
    end

    context '登録できない場合' do
      it 'タイトルが空では登録できない' do
        @task.title = ''
        @task.valid?
        expect(@task.errors.full_messages).to include("Title can't be blank")
      end

      it 'タイトルが101文字以上では登録できない' do
        @task.title = 'a' * 101
        @task.valid?
        expect(@task.errors.full_messages).to include('Title is too long (maximum is 100 characters)')
      end

      it '説明が空では登録できない' do
        @task.description = ''
        @task.valid?
        expect(@task.errors.full_messages).to include("Description can't be blank")
      end

      it '期限日が空では登録できない' do
        @task.due_date = nil
        @task.valid?
        expect(@task.errors.full_messages).to include("Due date can't be blank")
      end

      it '完了ステータスが空では登録できない' do
        @task.completed = nil
        @task.valid?
        expect(@task.errors.full_messages).to include("Completed is not included in the list")
      end

      it 'display_color_idが1未満では登録できない' do
        @task.display_color_id = 0
        @task.valid?
        expect(@task.errors.full_messages).to include('Display color must be greater than 0')
      end

      it 'display_color_idが6を超える場合は登録できない' do
        @task.display_color_id = 7
        @task.valid?
        expect(@task.errors.full_messages).to include('Display color must be less than or equal to 6')
      end

      it 'display_type_idが1未満では登録できない' do
        @task.display_type_id = 0
        @task.valid?
        expect(@task.errors.full_messages).to include('Display type must be greater than 0')
      end

      it 'display_type_idが4を超える場合は登録できない' do
        @task.display_type_id = 5
        @task.valid?
        expect(@task.errors.full_messages).to include('Display type must be less than or equal to 4')
      end

      it 'ユーザーが紐づいていないければ登録できない' do
        @task.user = nil
        @task.valid?
        expect(@task.errors.full_messages).to include('User must exist')
      end
    end
  end


  describe 'スコープのテスト' do
    before do
      FactoryBot.create(:task, title: 'Task 1', completed: true, due_date: Date.today)
      FactoryBot.create(:task, title: 'Task 2', completed: false, due_date: Date.today)
    end

    it '完了済みのタスクを取得できる' do
      expect(Task.completed.pluck(:title)).to include('Task 1')
    end

    it '未完了のタスクを取得できる' do
      expect(Task.pending.pluck(:title)).to include('Task 2')
    end

    it '本日が期限のタスクを取得できる' do
      expect(Task.due_today.pluck(:title)).to match_array(['Task 1', 'Task 2'])
    end
  end

  describe 'インスタンスメソッドのテスト' do
    it '完了ステータスをトグルできる' do
      task = FactoryBot.create(:task, completed: false)
      expect { task.toggle_completion! }.to change { task.reload.completed }.from(false).to(true)
    end
  end

  describe 'コールバックのテスト' do
    it 'デフォルト値が設定されること' do
      task = FactoryBot.create(:task, display_color_id: nil, display_type_id: nil)
      expect(task.display_color_id).to eq(1)
      expect(task.display_type_id).to eq(1)
    end
  end
end