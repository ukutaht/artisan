defmodule Artisan.Iterations.ControllerTest do
  use Artisan.ConnCase

  def create_project do
    conn()
      |> post("/api/projects", %{project: %{name: "Project name"}})
      |> json_response(200)
  end

  setup do
    project = create_project()

    {:ok, project: project}
  end

  test "gets the current iteration", %{project: project} do
    res = conn()
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    assert Map.has_key?(res, "stories")
    assert Map.has_key?(res, "all_iterations")
    assert res["iteration"]["state"] == "planning"
  end

  test "gets a specific iteration", %{project: project} do
    created = conn
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)
      |> Map.get("iteration")

    res = conn()
      |> get("/api/projects/#{project["id"]}/iterations/#{created["number"]}")
      |> json_response(200)

    assert Map.has_key?(res, "stories")
    assert Map.has_key?(res, "all_iterations")
    assert res["iteration"]["state"] == "planning"
  end

  test "completes an iteration", %{project: project} do
    %{"iteration" => iteration} = conn
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    res = conn
      |> post("/api/iterations/#{iteration["id"]}/complete")
      |> json_response(200)

    assert res["iteration"]["state"] == "completed"
  end

  test "creates a new iteration", %{project: project} do
    res = conn
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)

    assert res["iteration"]["state"] == "planning"
  end

  test "starts new iteration", %{project: project} do
    %{"iteration" => created} = conn
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)

    started = conn
      |> post("/api/iterations/#{created["id"]}/start")
      |> json_response(200)

    assert started["state"] == "working"
  end
end
