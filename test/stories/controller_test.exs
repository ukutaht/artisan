defmodule Artisan.StoryControllerTest do
  use Artisan.ConnCase

  setup do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Artisan.Repo)
  end

  test "creates a story when valid" do
    story_params = %{
      name: "name",
      state: "ready",
      estimate: 2.25,
      optimistic: 1,
      realistic: 1,
      pessimistic: 2,
      position: 1,
      tags: ["bug"]
    }
    conn = conn() |> post("/api/stories", %{story: story_params})

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
    story_params = %{
      name: nil
    }
    conn = conn() |> post("/api/stories", %{story: story_params})

    res = json_response(conn, 400)

    assert res["errors"] == %{"name" => "can't be blank"}
  end
end
