defmodule Artisan.StoryControllerTest do
  use Phoenix.ChannelTest
  use Artisan.ConnCase
  alias Artisan.Projects.Channel
  import Artisan.Test.APIHelpers

  @valid_story_params %{
    name: "name",
    state: "ready",
    estimate: 2.25,
    optimistic: 1,
    realistic: 1,
    pessimistic: 2,
    tags: ["bug"],
    acceptance_criteria: "Acceptance criteria"
  }

  @invalid_story_params %{
    name: nil,
    state: "ready"
  }

  setup do
    user = create_user()
    project = create_project(user["token"])

    {:ok, project: project, user: user}
  end

  test "creates a story when valid", %{project: project, user: user} do
    story = Map.merge(@valid_story_params, %{
      project_id: project["id"],
      assignee_id: user["user"]["id"]
    })

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
    assert res["acceptance_criteria"] == "Acceptance criteria"
    assert res["created_at"] != nil
    assert res["creator"] == user["user"]
    assert res["assignee"] == user["user"]
  end

  test "broadcasts story create", %{project: project, user: user} do
    Channel.subscribe(project["id"])

    create_story(user["token"], project["id"])
    created = Repo.one(Artisan.Story) |> Repo.preload(:creator) |> Repo.preload(:assignee)
    json = Phoenix.View.render(Artisan.Stories.View, "story.json", story: created)

    assert_broadcast("story:add", ^json)
  end

  test "does not create a story when invalid", %{project: project, user: user} do
    story = Map.put(@invalid_story_params, :project_id, project["id"])

    res = authenticated_conn(user["token"])
      |> post("/api/stories", %{story: story})
      |> json_response(400)

    assert res["errors"] == %{"name" => ["can't be blank"]}
  end

  test "updates story when valid", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name", acceptance_criteria: "new ac"}})
      |> json_response(200)

    assert res["name"] == "new name"
    assert res["acceptance_criteria"] == "new ac"
    assert res["creator"] == user["user"]
  end

  test "broadcasts story update", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])

    Channel.subscribe(project["id"])

    authenticated_conn(user["token"])
      |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})

    updated = Repo.get(Artisan.Story, id) |> Repo.preload(:creator) |> Repo.preload(:assignee)
    json = Phoenix.View.render(Artisan.Stories.View, "story.json", story: updated)

    assert_broadcast("story:update", ^json)
  end

  test "does not update a story when invalid", %{project: project, user: user} do
    %{"id" => id} = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> put("/api/stories/#{id}", %{story: @invalid_story_params})
      |> json_response(400)

    assert res["errors"] == %{"name" => ["can't be blank"]}
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

    Channel.subscribe(project["id"])

    authenticated_conn(user["token"])
      |> post("/api/stories/#{id}/move", %{state: "working", index: 0})

    stories = Artisan.Stories.by_state(project["id"])
    json = Phoenix.View.render(Artisan.Stories.View, "by_state.json", stories: stories)

    assert_broadcast("story:move", ^json)
  end

  test "gets stories for the current iteration", %{project: project, user: user} do
    created = create_story(user["token"], project["id"])

    res = authenticated_conn(user["token"])
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    [found] = res["stories"]["ready"]

    assert found == created
  end

  test "deletes a story", %{project: project, user: user} do
    created = create_story(user["token"], project["id"])

    authenticated_conn(user["token"])
      |> delete("/api/stories/#{created["id"]}")
      |> json_response(200)

    res = authenticated_conn(user["token"])
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    assert res["stories"]["ready"] == []
  end
end
