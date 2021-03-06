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
      post "/invite", Controller, :invite
    end

    scope "/projects", Projects do
      get    "/",                               Controller, :all
      post   "/",                               Controller, :create
      get    "/:slug",                          Controller, :find
      put    "/:id",                            Controller, :update
      post   "/:id/collaborators",              Controller, :add_collaborator
      delete "/:id/collaborators/:user_id",     Controller, :remove_collaborator
      get    "/:id/collaborators/autocomplete", Controller, :autocomplete_collaborators
    end

    scope "/projects/:project_id/iterations", Iterations do
      get  "/current",                Controller, :current
      get  "/:number",                Controller, :get
      get  "/by-story/:story_number", Controller, :get_by_story
      post "/create",                 Controller, :create
    end

    scope "/iterations", Iterations do
      post "/:iteration_id/complete", Controller, :complete
      post "/:iteration_id/start",    Controller, :start
    end
  end

  if Mix.env == :dev do
    forward "/emails", Bamboo.EmailPreviewPlug
  end
end
