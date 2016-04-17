defmodule Artisan.Test.APIHelper do
  use Phoenix.ConnTest
  @endpoint Artisan.Endpoint

  @valid_user %{
    name: "User name",
    email: "user@example.com",
    password: "password"
  }

  def authenticated_conn(user_token) do
    conn()
      |> put_req_header("authorization", "Bearer #{user_token}")
  end

  def create_user do
    conn()
      |> post("/api/users/signup", %{user: @valid_user})
      |> json_response(200)
  end

  def create_project(user_token) do
    authenticated_conn(user_token)
      |> post("/api/projects", %{project: %{name: "Project name"}})
      |> json_response(200)
  end
end
