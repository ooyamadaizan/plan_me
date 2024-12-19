require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    @user = FactoryBot.build(:user)
  end

  describe 'ユーザー新規登録' do
    context '新規登録できる場合' do
      it 'nicknameとemail、passwordとpassword_confirmationが存在すれば登録できる' do
        expect(@user).to be_valid
      end
    end
    context '新規登録できない場合' do
      context 'nicknameのバリデーション' do
        it 'nicknameが空では登録できない' do
          @user.nickname = ''
          @user.valid?
          expect(@user.errors.full_messages).to include("Nickname can't be blank")
        end
        it 'nicknameが51文字以上では登録できない' do
          @user.nickname = 'a' * 51
          @user.valid?
          expect(@user.errors.full_messages).to include('Nickname is too long (maximum is 50 characters)')
        end
      end
      context 'emailのバリデーション' do
        it 'emailが空では登録できない' do
          @user.email = ''
          @user.valid?
          expect(@user.errors.full_messages).to include("Email can't be blank")
        end
        it 'emailが重複した場合は登録できない' do
          @user.save
          another_user = FactoryBot.build(:user, email: @user.email)
          another_user.valid?
          expect(another_user.errors.full_messages).to include('Email has already been taken')
        end
        it 'emailは@を含まないと登録できない' do
          @user.email = 'testexample.com'
          @user.valid?
          expect(@user.errors.full_messages).to include('Email is invalid')
        end
        it 'emailは不正な形式では登録できない' do
          invalid_emails = ['user.name@', '@example.com', 'user@domain,com']
    
          invalid_emails.each do |invalid_email|
            @user.email = invalid_email
            @user.valid?
            expect(@user.errors.full_messages).to include('Email is invalid'), "#{invalid_email} が不正と認識されません"
          end
        end
      end
      context 'passwordのバリデーション' do
        it 'passwordが空では登録できない' do
          @user.password = ''
          @user.valid?
          expect(@user.errors.full_messages).to include("Password can't be blank")
        end
        it 'passwordとpassword_confirmationが不一致では登録できない' do
          @user.password = 'password1'
          @user.password_confirmation = 'password2'
          @user.valid?
          expect(@user.errors.full_messages).to include("Password confirmation doesn't match Password")
        end

        it 'passwordが5文字以下では登録できない' do
          @user.password = 'a' * 5
          @user.valid?
          expect(@user.errors.full_messages).to include("Password is too short (minimum is 6 characters)")
        end
        it 'passwordが129文字以上では登録できない' do
          @user.password = 'a' * 129
          @user.valid?
          expect(@user.errors.full_messages).to include("Password is too long (maximum is 128 characters)")
        end
      end
    end
  end
end
