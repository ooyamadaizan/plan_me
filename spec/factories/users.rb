FactoryBot.define do
  factory :user do
    nickname              { Faker::Name.name }
    email                 { Faker::Internet.email }
    password              { '012345' }
    password_confirmation { password }
  end
end