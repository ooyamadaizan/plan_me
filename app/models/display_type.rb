class DisplayType < ActiveHash::Base
  self.data = [
    { id: 1, name: '●', code: 'circle' },
    { id: 2, name: '▲', code: 'triangle' },
    { id: 3, name: '■', code: 'square' },
    { id: 4, name: '★', code: 'star' }
  ]

  include ActiveHash::Associations
  has_many :tasks
end
