defmodule Artisan.StoryControllerTest do
  use Artisan.ConnCase

  setup do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Artisan.Repo)
  end

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

  def create_story do
    conn()
      |> post("/api/stories", %{story: @valid_story_params})
      |> json_response(200)
  end

  test "creates a story when valid" do
    conn = conn() |> post("/api/stories", %{story: @valid_story_params})

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
    conn = conn() |> post("/api/stories", %{story: @invalid_story_params})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "updates story when valid" do
    %{"id" => id} = create_story()

    conn = conn() |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})

    res = json_response(conn, 200)

    assert res["name"] == "new name"
  end

  test "does not update a story when invalid" do
    %{"id" => id} = create_story()

    conn = conn() |> put("/api/stories/#{id}", %{story: @invalid_story_params})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "moves a story" do
    %{"id" => id} = create_story()

    res = conn()
      |> post("/api/stories/#{id}/move", %{state: "working", index: 0})
      |> json_response(200)

    assert res["state"] == "working"
  end

  test "gets stories by state" do
    created = create_story()

    res = conn()
      |> get("/api/stories/by-state")
      |> json_response(200)

    [found] = res["ready"]

    assert found == created
  end
end
