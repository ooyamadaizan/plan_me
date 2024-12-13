class DisplayColor < ActiveHash::Base
  self.data = [
    { id: 1, name: '---' },
    { id: 2, name: 'Red' },
    { id: 3, name: 'Blue' },
    { id: 4, name: 'Green' },
    { id: 5, name: 'yellow' },
    { id: 6, name: 'purple' },
    { id: 7, name: 'orange' }
  ]

  include ActiveHash::Associations
  has_many :tasks

end