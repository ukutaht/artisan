defmodule Artisan.Projects.ControllerTest do
  use Artisan.ConnCase
  import Artisan.Test.APIHelper

  @valid_project_params %{
    name: "name"
  }

  setup do
    user = create_user()

    {:ok, user: user}
  end

  test "creates a new project when valid", %{user: user} do
    conn = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})

    res = json_response(conn, 200)

    assert res["name"] == "name"
  end

  test "gets all projects", %{user: user} do
    authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})

    res = authenticated_conn(user["token"])
      |> get("/api/projects")
      |> json_response(200)

    assert Enum.count(res) == 1
  end
end
