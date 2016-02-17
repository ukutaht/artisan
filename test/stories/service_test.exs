defmodule Artisan.StoriesTest do
  use Artisan.ModelCase
  alias Artisan.Stories
  alias Artisan.Story

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

  test "creates a story with valid params" do
    {:ok, _} = Stories.create(@valid_story_params)

    assert Repo.aggregate(Story, :count, :id) == 1
  end

  test "does not create a story with invalid params" do
    {:error, _} = Stories.create(@invalid_story_params)

    assert Stories.count() == 0
  end

  test "updates a story with valid params" do
    {:ok, created} = Stories.create(@valid_story_params)
    {:ok, updated} = Stories.update(created.id, %{name: "new name"})

    assert Repo.get(Story, updated.id).name == "new name"
  end
end
