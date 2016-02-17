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

    get "/stories", StoryController, :all
    post "/stories", StoryController, :create
  end

  scope "/", Artisan do
    pipe_through :browser

    get "*anything", PageController, :index
  end

end
