defmodule Artisan.Iterations.ControllerTest do
  use Artisan.ConnCase
  import Artisan.Test.APIHelpers

  setup do
    user = create_user()
    project = create_project(user["token"])

    {:ok, project: project, user: user}
  end

  test "gets the current iteration", %{project: project, user: user} do
    res = authenticated_conn(user["token"])
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    assert Map.has_key?(res, "stories")
    assert Map.has_key?(res, "all_iterations")
    assert res["iteration"]["state"] == "planning"
  end

  test "404s when trying to get current iteration for nonexistent project", %{user: user} do
    res = authenticated_conn(user["token"])
      |> get("/api/projects/9999999/iterations/current")

    assert res.status === 404
  end

  test "gets a specific iteration", %{project: project, user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)
      |> Map.get("iteration")

    res = authenticated_conn(user["token"])
      |> get("/api/projects/#{project["id"]}/iterations/#{created["number"]}")
      |> json_response(200)

    assert Map.has_key?(res, "stories")
    assert Map.has_key?(res, "all_iterations")
    assert res["iteration"]["state"] == "planning"
  end

  test "completes an iteration", %{project: project, user: user} do
    %{"iteration" => iteration} = authenticated_conn(user["token"])
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    res = authenticated_conn(user["token"])
      |> post("/api/iterations/#{iteration["id"]}/complete")
      |> json_response(200)

    assert res["iteration"]["state"] == "completed"
  end

  test "creates a new iteration", %{project: project, user: user} do
    res = authenticated_conn(user["token"])
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)

    assert res["iteration"]["state"] == "planning"
  end

  test "starts new iteration", %{project: project, user: user} do
    %{"iteration" => created} = authenticated_conn(user["token"])
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)

    started = authenticated_conn(user["token"])
      |> post("/api/iterations/#{created["id"]}/start")
      |> json_response(200)

    assert started["state"] == "working"
  end
end
