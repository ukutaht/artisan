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
    conn()
      |> post("/api/projects/#{project_id}/stories", %{story: @valid_story_params})
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

  test "creates a story when valid" do
    %{"id" => project_id} = create_project()
    conn = conn() |> post("/api/projects/#{project_id}/stories", %{story: @valid_story_params})

    res = json_response(conn, 200)

    assert res["name"] == "name"
    assert res["state"] == "ready"
    assert res["estimate"] == 2.25
    assert res["optimistic"] == 1
    assert res["realistic"] == 1
    assert res["pessimistic"] == 2
    assert res["tags"] == ["bug"]
  end

  test "does not create a story when invalid" do
    %{"id" => project_id} = create_project()
    conn = conn() |> post("/api/projects/#{project_id}/stories", %{story: @invalid_story_params})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "updates story when valid", %{project: project} do
    %{"id" => id} = create_story(project)

    conn = conn() |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})

    res = json_response(conn, 200)

    assert res["name"] == "new name"
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

    assert res["state"] == "working"
  end

  test "gets stories by state", %{project: project} do
    created = create_story(project)

    res = conn()
      |> get("/api/stories/by-state")
      |> json_response(200)

    [found] = res["ready"]

    assert found == created
  end
end
