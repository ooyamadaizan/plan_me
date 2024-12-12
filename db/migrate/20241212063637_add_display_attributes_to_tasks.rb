class AddDisplayAttributesToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :display_color, :string
    add_column :tasks, :display_type, :string
  end
end
