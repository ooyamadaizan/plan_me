class DisplayColor < ActiveHash::Base
  self.data = [
    { id: 1, name: '赤', code: 'red', hex: '#FF0000', rgb: '255,0,0' },
    { id: 2, name: '青', code: 'blue', hex: '#0000FF', rgb: '0,0,255' },
    { id: 3, name: '緑', code: 'green', hex: '#008000', rgb: '0,128,0' },
    { id: 4, name: '黄', code: 'yellow', hex: '#FFFF00', rgb: '255,255,0' },
    { id: 5, name: '紫', code: 'purple', hex: '#800080', rgb: '128,0,128' },
    { id: 6, name: '橙', code: 'orange', hex: '#FFA500', rgb: '255,165,0' }
  ]

  include ActiveHash::Associations
  has_many :tasks

end