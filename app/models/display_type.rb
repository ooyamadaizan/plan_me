class DisplayType < ActiveHash::Base
  self.data = [
    { id: 1, name: '---' },
    { id: 2, name: 'circle' },
    { id: 3, name: 'square' },
    { id: 4, name: 'triangle' },
    { id: 5, name: 'star' }
  ]

  include ActiveHash::Associations
  has_many :tasks
end
