require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    @user = FactoryBot.build(:user)
  end
end

describe 'X' do
  it 'Y' do
    # before内の処理が完了してから実行される
  end
  it 'Z' do
    # before内の処理が完了してから実行される
  end
end
end
