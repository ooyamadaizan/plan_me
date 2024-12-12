module TasksHelper
  def color_to_rgb(color_name)
    case color_name.downcase
    when "red"
      "255, 0, 0"
    when "blue"
      "0, 0, 255"
    when "green"
      "0, 255, 0"
    when "yellow"
      "255, 255, 0"
    when "purple"
      "128, 0, 128"
    when "orange"
      "255, 165, 0"
    else
      "0, 0, 0" # default to black if color is unknown
    end
  end
end