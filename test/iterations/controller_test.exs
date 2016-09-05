defmodule Artisan.Iterations.ControllerTest do
  use Artisan.ConnCase
  import Artisan.Test.APIHelpers

  setup do
    user = create_user()
    project = create_project(user["token"])
    iteration = Artisan.Iterations.current(project["id"])[:iteration]

    {:ok, project: project, user: user, iteration: iteration}
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

  test "gets a specific iteration", %{project: project, user: user, iteration: iteration} do
    res = authenticated_conn(user["token"])
      |> get("/api/projects/#{project["id"]}/iterations/#{iteration.number}")
      |> json_response(200)

    assert Map.has_key?(res, "stories")
    assert Map.has_key?(res, "all_iterations")
    assert res["iteration"]["state"] == "planning"
  end

  describe "getting by story" do
    test "gets an iteration by story", %{project: project, user: user, iteration: iteration} do
      story = Artisan.Test.Helpers.create_story(project["id"], user["user"]["id"])

      res = authenticated_conn(user["token"])
        |> get("/api/projects/#{project["id"]}/iterations/by-story/#{story.number}")
        |> json_response(200)

      assert Map.has_key?(res, "stories")
      assert Map.has_key?(res, "story")
      assert Map.has_key?(res, "all_iterations")
      assert res["iteration"]["id"] == iteration.id
    end

    test "returns 404 if story not found", %{project: project, user: user} do
      res = authenticated_conn(user["token"])
        |> get("/api/projects/#{project["id"]}/iterations/by-story/-1")

      assert res.status == 404
    end
  end

  test "completes an iteration", %{user: user, iteration: iteration} do
    res = authenticated_conn(user["token"])
      |> post("/api/iterations/#{iteration.id}/complete")
      |> json_response(200)

    assert res["iteration"]["state"] == "completed"
  end

  test "creates a new iteration", %{project: project, user: user, iteration: iteration} do
    authenticated_conn(user["token"])
      |> post("/api/iterations/#{iteration.id}/complete")
      |> json_response(200)

    res = authenticated_conn(user["token"])
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)

    assert res["iteration"]["state"] == "planning"
  end

  test "starts new iteration", %{project: project, user: user, iteration: iteration} do
    authenticated_conn(user["token"])
      |> post("/api/iterations/#{iteration.id}/complete")
      |> json_response(200)

    %{"iteration" => created} = authenticated_conn(user["token"])
      |> post("/api/projects/#{project["id"]}/iterations/create")
      |> json_response(200)

    started = authenticated_conn(user["token"])
      |> post("/api/iterations/#{created["id"]}/start")
      |> json_response(200)

    assert started["state"] == "working"
  end
end
