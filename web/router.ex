defmodule Artisan.Router do
  use Artisan.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authenticated do
    plug Artisan.Users.AuthenticationPlug
  end

  scope "api/users", Artisan.Users do
    pipe_through :api

    post "/signup", Controller, :signup
    post "/login", Controller, :login
  end

  scope "/api", Artisan do
    pipe_through :api
    pipe_through :authenticated

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
end
