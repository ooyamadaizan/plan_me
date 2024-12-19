FactoryBot.define do
  factory :task do
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph }
    due_date { Faker::Date.between(from: 30.days.ago, to: 30.days.from_now) }
    completed { false }
    display_color_id { rand(1..6) }
    display_type_id { rand(1..4) }
    association :user
  end
end