defmodule Artisan.Test.APIHelper do
  use Phoenix.ConnTest
  @endpoint Artisan.Endpoint

  @user %{
    name: "User name",
    email: "user@example.com",
    password: "password"
  }

  @story %{
    name: "name",
    state: "ready",
    estimate: 2.25,
    optimistic: 1,
    realistic: 1,
    pessimistic: 2,
    tags: ["bug"]
  }

  def authenticated_conn(user_token) do
    build_conn()
      |> put_req_header("authorization", "Bearer #{user_token}")
  end

  def create_user do
    build_conn()
      |> post("/api/users/signup", %{user: @user})
      |> json_response(200)
  end

  def create_project(token) do
    authenticated_conn(token)
      |> post("/api/projects", %{project: %{name: "Project name"}})
      |> json_response(200)
  end

  def create_story(token, project_id) do
    story = Map.put(@story, :project_id, project_id)

    authenticated_conn(token)
      |> post("/api/stories", %{story: story})
      |> json_response(200)
  end

end
