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
    tags: ["bug"]
  }

  @invalid_story_params %{
    name: nil
  }

  def create_in_state(state) do
    {:ok, created} = Stories.create(%{@valid_story_params | state: state})
    created
  end

  def find_in_state(state) do
    Stories.by_state()[state]
  end

  test "creates a story with valid params" do
    {:ok, _} = Stories.create(@valid_story_params)

    assert Stories.count() == 1
  end

  test "story is created in the first position, order maintained" do
    {:ok, old} = Stories.create(@valid_story_params)
    {:ok, new} = Stories.create(@valid_story_params)

    [found1, found2] = find_in_state(@valid_story_params[:state])

    assert found1.id == new.id
    assert found2.id == old.id
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

  test "does not update a story with invalid params" do
    {:ok, created} = Stories.create(@valid_story_params)

    assert match?({:error, _}, Stories.update(created.id, %{name: nil}))
  end

  test "finds all by state" do
    ready = create_in_state("ready")
    working = create_in_state("working")

    %{"ready" => [found_in_ready], "working" => [found_in_working]} = Stories.by_state()

    assert found_in_ready.id == ready.id
    assert found_in_working.id == working.id
  end

  test "orders stories by position in states" do
    old = create_in_state("ready")
    new = create_in_state("ready")

    %{"ready" => [found1, found2]} = Stories.by_state()

    assert found1.id == new.id
    assert found2.id == old.id
  end

  test "moving to same state same index is a no-op" do
    second = create_in_state("working")
    first  = create_in_state("working")

    {:ok, _} = Stories.move(first.id, "working", 0)
    [found1, found2] = find_in_state("working")

    assert found1.id == first.id
    assert found2.id == second.id
  end

  test "moves a story to an empty state" do
    story = create_in_state("ready")

    {:ok, _} = Stories.move(story.id, "working", 0)
    [found1] = find_in_state("working")

    assert found1.id == story.id
  end

  test "moves a story to bottom" do
    second = create_in_state("working")
    first  = create_in_state("working")

    {:ok, _} = Stories.move(first.id, "working", 1)
    [found1, found2] = find_in_state("working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to top" do
    second = create_in_state("working")
    first  = create_in_state("working")

    {:ok, _} = Stories.move(second.id, "working", 0)
    [found1, found2] = find_in_state("working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to middle" do
    third = create_in_state("working")
    second = create_in_state("working")
    first  = create_in_state("working")

    {:ok, _} = Stories.move(first.id, "working", 1)
    [found1, found2, found3] = find_in_state("working")

    assert found1.id == second.id
    assert found2.id == first.id
    assert found3.id == third.id

    assert found1.position != found2.position
  end

  test "moves a story to the bottom of a different state" do
    story = create_in_state("ready")
    second = create_in_state("working")
    first  = create_in_state("working")

    {:ok, _} = Stories.move(story.id, "working", 2)

    [found1, found2, found3] = find_in_state("working")

    assert found1.id == first.id
    assert found2.id == second.id
    assert found3.id == story.id
  end

  test "moves a story to the top of a different state" do
    story = create_in_state("ready")
    second = create_in_state("working")
    first  = create_in_state("working")

    {:ok, _} = Stories.move(story.id, "working", 0)

    [found1, found2, found3] = find_in_state("working")

    assert found1.id == story.id
    assert found2.id == first.id
    assert found3.id == second.id
  end

  test "moves a story to the middle of a different state" do
    story = create_in_state("ready")
    second = create_in_state("working")
    first  = create_in_state("working")

    {:ok, _} = Stories.move(story.id, "working", 1)

    [found1, found2, found3] = find_in_state("working")

    assert found1.id == first.id
    assert found2.id == story.id
    assert found3.id == second.id
  end

  test "indexing into very large numbers just goes to the end" do
    ready = create_in_state("ready")
    working  = create_in_state("working")

    {:ok, _} = Stories.move(ready.id, "working", 100)

    [found1, found2] = find_in_state("working")

    assert found1.id == working.id
    assert found2.id == ready.id
  end
end
