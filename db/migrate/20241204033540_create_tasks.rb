class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string     :title,       null: false
      t.text       :description, null: false
      t.date       :due_date,    null: false, index: true
      t.boolean    :completed,   null: false, default: false
      t.references :user,        null: false, foreign_key: true
      t.timestamps
    end
  end
end
