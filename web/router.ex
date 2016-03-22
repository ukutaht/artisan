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

    post "/users", Users.Controller, :signup

    post "/projects", Projects.Controller, :create
    get "/projects", Projects.Controller, :all

    get "/projects/:project_id/iterations/current",  Iterations.Controller, :current
    get "/projects/:project_id/iterations/:number",  Iterations.Controller, :get
    post "/projects/:project_id/iterations/create",  Iterations.Controller, :create

    scope "/iterations", Iterations do
      post "/:iteration_id/complete", Controller, :complete
      post "/:iteration_id/start", Controller, :start
    end

    scope "/stories", Stories do
      put "/:id", Controller, :update
      post "/", Controller, :create
      post "/:id/move", Controller, :move
    end
  end

  scope "/", Artisan do
    pipe_through :browser

    get "*anything", PageController, :index
  end

end
