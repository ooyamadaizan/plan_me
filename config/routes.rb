Rails.application.routes.draw do
  devise_for :users
  root to: 'tasks#index'
  resources :tasks do
    collection do
      get 'reorder'
    end
  end
end
