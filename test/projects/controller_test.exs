defmodule Artisan.Projects.ControllerTest do
  use Artisan.ConnCase

  @valid_project_params %{
    name: "name"
  }

  test "creates a new project when valid" do
    conn = conn() |> post("/api/projects", %{project: @valid_project_params})

    res = json_response(conn, 200)

    assert res["name"] == "name"
  end

  test "gets all projects" do
    conn() |> post("/api/projects", %{project: @valid_project_params})

    res = conn()
      |> get("/api/projects")
      |> json_response(200)

    assert Enum.count(res) == 1
  end
end
