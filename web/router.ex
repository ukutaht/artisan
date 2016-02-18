defmodule Artisan.Router do
  use Artisan.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Artisan do
    pipe_through :api

    get "/stories",  Stories.Controller, :all
    post "/stories", Stories.Controller, :create
    put "/stories/:id",  Stories.Controller, :update
    post "/stories/:id/move",  Stories.Controller, :move
  end

  scope "/", Artisan do
    pipe_through :browser

    get "*anything", PageController, :index
  end

end
