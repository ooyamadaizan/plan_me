class AddStartTimeToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :start_time, :datetime
  end
end
