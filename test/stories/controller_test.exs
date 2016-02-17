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
    position: 1,
    tags: ["bug"]
  }

  @invalid_story_params %{
    name: nil
  }

  test "creates a story when valid" do
    conn = conn() |> post("/api/stories", %{story: @valid_story_params})

    res = json_response(conn, 200)

    assert res["name"] == "name"
    assert res["state"] == "ready"
    assert res["estimate"] == 2.25
    assert res["optimistic"] == 1
    assert res["realistic"] == 1
    assert res["pessimistic"] == 2
    assert res["position"] == 1
    assert res["tags"] == ["bug"]
  end

  test "does not create a story when invalid" do
    conn = conn() |> post("/api/stories", %{story: @invalid_story_params})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end

  test "updates story when valid" do
    create = conn() |> post("/api/stories", %{story: @valid_story_params})
    %{"id" => id} = json_response(create, 200)

    conn = conn() |> put("/api/stories/#{id}", %{story: %{@valid_story_params | name: "new name"}})

    res = json_response(conn, 200)

    assert res["name"] == "new name"
  end

  test "does not update a story when invalid" do
    create = conn() |> post("/api/stories", %{story: @valid_story_params})
    id = json_response(create, 200)["id"]

    conn = conn() |> put("/api/stories/#{id}", %{story: @invalid_story_params})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end
end
