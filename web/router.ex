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

    post "/projects", Projects.Controller, :create
    get "/projects", Projects.Controller, :all

    get "/projects/:project_id/iterations/current",  Iterations.Controller, :current
    post "/projects/:project_id/iterations/create",  Iterations.Controller, :create

    post "/iterations/:iteration_id/complete", Iterations.Controller, :complete
    post "/iterations/:iteration_id/start", Iterations.Controller, :start

    put "/stories/:id",  Stories.Controller, :update
    post "/stories", Stories.Controller, :create
    post "/stories/:id/move",  Stories.Controller, :move
  end

  scope "/", Artisan do
    pipe_through :browser

    get "*anything", PageController, :index
  end

end
