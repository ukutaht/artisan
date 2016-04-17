defmodule Artisan.StoryControllerTest do
  use Artisan.ConnCase
  import Artisan.Test.APIHelper

  @valid_story_params %{
    name: "name",
    state: "ready",
    estimate: 2.25,
    optimistic: 1,
    realistic: 1,
    pessimistic: 2,
    tags: ["bug"]
  }

  @invalid_story_params %{
    name: nil
  }

  setup do
    user = create_user()
    project = create_project(user["token"])

    {:ok, project: project, user: user}
  end

  test "creates a story when valid", %{project: project, user: user} do
    story = Map.put(@valid_story_params, :project_id, project["id"])

    conn = authenticated_conn(user["token"])
      |> post("/api/stories", %{story: story})

    res = json_response(conn, 200)

    assert res["name"] == "name"
    assert res["project_id"] == project["id"]
    assert res["state"] == "ready"
    assert res["estimate"] == 2.25
    assert res["optimistic"] == 1
    assert res["realistic"] == 1
    assert res["pessimistic"] == 2
    assert res["tags"] == ["bug"]
  end

  test "broadcasts story create", %{project: project, user: user} do
    topic = "boards:#{project["id"]}"

    Artisan.Endpoint.subscribe(self, topic)

    create_story(user["token"], project["id"])
    created = Repo.last(Artisan.Story)

    assert_receive %Phoenix.Socket.Broadcast{
      topic: ^topic,
      event: "add:story",
      payload: ^created
    }
  end

  test "does not create a story when invalid", %{project: project, user: user} do
    story = Map.put(@invalid_story_params, :project_id, project["id"])

    res = authenticated_conn(user["token"])
      |> post("/api/stories", %{story: story})
      |> json_response(400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "updates story when valid", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})
      |> json_response(200)

    assert res["name"] == "new name"
  end

  test "broadcasts story update", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])
    topic = "boards:#{project["id"]}"

    Artisan.Endpoint.subscribe(self, topic)

    authenticated_conn(user["token"])
      |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})

    updated = Repo.get(Artisan.Story, id)

    assert_receive %Phoenix.Socket.Broadcast{
      topic: ^topic,
      event: "update:story",
      payload: ^updated
    }
  end

  test "does not update a story when invalid", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> put("/api/stories/#{id}", %{story: @invalid_story_params})
      |> json_response(400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "moves a story", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> post("/api/stories/#{id}/move", %{state: "working", index: 0})
      |> json_response(200)

    assert Enum.count(res["working"]) == 1
  end

  test "returns empty arrays for states with 0 stories", %{user: user, project: project} do
    %{"id" => id} = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> post("/api/stories/#{id}/move", %{state: "working", index: 0})
      |> json_response(200)

    assert res["backlog"] == []
    assert res["ready"] == []
    assert res["completed"] == []
  end

  test "broadcasts a story move to clients", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])
    topic = "boards:#{project["id"]}"

    Artisan.Endpoint.subscribe(self, topic)

    authenticated_conn(user["token"])
      |> post("/api/stories/#{id}/move", %{state: "working", index: 0})

    stories = Artisan.Stories.by_state(project["id"])

    assert_receive %Phoenix.Socket.Broadcast{
      topic: ^topic,
      event: "move:story",
      payload: ^stories
    }
  end

  test "gets stories for the current iteration", %{project: project, user: user} do
    created = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    [found] = res["stories"]["ready"]

    assert found == created
  end
end
