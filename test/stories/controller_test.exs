defmodule Artisan.StoryControllerTest do
  use Artisan.ConnCase

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

  def create_story(%{"id" => project_id}) do
    story = Map.put(@valid_story_params, :project_id, project_id)

    conn()
      |> post("/api/stories", %{story: story})
      |> json_response(200)
  end

  def create_project do
    conn()
      |> post("/api/projects", %{project: %{name: "Project name"}})
      |> json_response(200)
  end

  setup do
    project = create_project()

    {:ok, project: project}
  end

  test "creates a story when valid", %{project: project} do
    story = Map.put(@valid_story_params, :project_id, project["id"])

    conn = conn() |> post("/api/stories", %{story: story})

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

  test "broadcasts story create", %{project: project} do
    topic = "boards:#{project["id"]}"

    Artisan.Endpoint.subscribe(self, topic)

    create_story(project)
    created = Repo.last(Artisan.Story)

    assert_receive %Phoenix.Socket.Broadcast{
      topic: ^topic,
      event: "add:story",
      payload: ^created
    }
  end

  test "does not create a story when invalid", %{project: project} do
    story = Map.put(@invalid_story_params, :project_id, project["id"])

    conn = conn() |> post("/api/stories", %{story: story})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "updates story when valid", %{project: project} do
    %{"id" => id} = create_story(project)

    conn = conn() |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})

    res = json_response(conn, 200)

    assert res["name"] == "new name"
  end

  test "broadcasts story update", %{project: project} do
    %{"id" => id} = create_story(project)
    topic = "boards:#{project["id"]}"

    Artisan.Endpoint.subscribe(self, topic)

    conn() |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})

    updated = Repo.get(Artisan.Story, id)

    assert_receive %Phoenix.Socket.Broadcast{
      topic: ^topic,
      event: "update:story",
      payload: ^updated
    }
  end

  test "does not update a story when invalid", %{project: project} do
    %{"id" => id} = create_story(project)

    conn = conn() |> put("/api/stories/#{id}", %{story: @invalid_story_params})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "moves a story", %{project: project} do
    %{"id" => id} = create_story(project)

    res = conn()
      |> post("/api/stories/#{id}/move", %{state: "working", index: 0})
      |> json_response(200)

    assert Enum.count(res["working"]) == 1
  end

  test "broadcasts a story move to clients", %{project: project} do
    %{"id" => id} = create_story(project)
    topic = "boards:#{project["id"]}"

    Artisan.Endpoint.subscribe(self, topic)

    conn() |> post("/api/stories/#{id}/move", %{state: "working", index: 0})

    stories = Artisan.Stories.by_state(project["id"])

    assert_receive %Phoenix.Socket.Broadcast{
      topic: ^topic,
      event: "move:story",
      payload: ^stories
    }
  end

  test "gets stories for the current iteration", %{project: project} do
    created = create_story(project)

    res = conn()
      |> get("/api/projects/#{project["id"]}/iterations/current")
      |> json_response(200)

    [found] = res["stories"]["ready"]

    assert found == created
  end
end
