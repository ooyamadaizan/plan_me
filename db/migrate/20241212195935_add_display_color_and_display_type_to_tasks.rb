class AddDisplayColorAndDisplayTypeToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :display_color_id, :integer
    add_column :tasks, :display_type_id, :integer
  end
end
