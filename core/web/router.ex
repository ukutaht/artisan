defmodule Artisan.Router do
  use Phoenix.Router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authenticated do
    plug Artisan.Users.AuthenticationPlug
  end

  scope "/api/users", Artisan.Users do
    pipe_through :api

    post "/signup", Controller, :signup
    post "/login", Controller, :login
  end

  scope "/api", Artisan do
    pipe_through :api
    pipe_through :authenticated

    scope "/users", Users do
      get "/current", Controller, :current
      put "/current", Controller, :update_profile
    end

    scope "/projects", Projects do
      get    "/",                               Controller, :all
      post   "/",                               Controller, :create
      get    "/:id",                            Controller, :find
      put    "/:id",                            Controller, :update
      post   "/:id/collaborators",              Controller, :add_collaborator
      delete "/:id/collaborators/:user_id",     Controller, :remove_collaborator
      get    "/:id/collaborators/autocomplete", Controller, :autocomplete_collaborators
    end

    scope "/projects/:project_id/iterations", Iterations do
      get  "/current", Controller, :current
      get  "/:number", Controller, :get
      post "/create",  Controller, :create
    end

    scope "/iterations", Iterations do
      post "/:iteration_id/complete", Controller, :complete
      post "/:iteration_id/start",    Controller, :start
    end

    scope "/stories", Stories do
      put    "/:id",      Controller, :update
      post   "/",         Controller, :create
      post   "/:id/move", Controller, :move
      delete "/:id",      Controller, :delete
    end
  end
end
