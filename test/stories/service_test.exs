defmodule Artisan.StoriesTest do
  use Artisan.ModelCase
  alias Artisan.Stories
  alias Artisan.Story

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
    {:ok, project} = Artisan.Projects.create(%{name: "project"})
    {:ok, %{project: project}}
  end

  def create_in_state(project_id, state) do
    {:ok, created} = Stories.create(project_id, %{@valid_story_params | state: state})
    created
  end

  def find_in_state(project_id, state) do
    Stories.by_state(project_id)[state]
  end

  test "creates a story with valid params", %{project: project} do
    {:ok, _} = Stories.create(project.id, @valid_story_params)

    assert Stories.count() == 1
  end

  test "story is created in the first position, order maintained", %{project: project} do
    {:ok, old} = Stories.create(project.id, @valid_story_params)
    {:ok, new} = Stories.create(project.id, @valid_story_params)

    [found1, found2] = find_in_state(project.id, @valid_story_params[:state])

    assert found1.id == new.id
    assert found2.id == old.id
  end

  test "does not create a story with invalid params", %{project: project} do
    {:error, _} = Stories.create(project.id, @invalid_story_params)

    assert Stories.count() == 0
  end

  test "updates a story with valid params", %{project: project} do
    {:ok, created} = Stories.create(project.id, @valid_story_params)
    {:ok, updated} = Stories.update(created.id, %{name: "new name"})

    assert Repo.get(Story, updated.id).name == "new name"
  end

  test "does not update a story with invalid params", %{project: project} do
    {:ok, created} = Stories.create(project.id, @valid_story_params)

    assert match?({:error, _}, Stories.update(created.id, %{name: nil}))
  end

  test "finds all by state", %{project: project} do
    ready = create_in_state(project.id, "ready")
    working = create_in_state(project.id, "working")

    %{"ready" => [found_in_ready], "working" => [found_in_working]} = Stories.by_state(project.id)

    assert found_in_ready.id == ready.id
    assert found_in_working.id == working.id
  end

  test "does not find stories that are not part of the project", %{project: project} do

    {:ok, project2} = Artisan.Projects.create(%{name: "project2"})
    create_in_state(project2.id, "ready")

    found = Stories.by_state(project.id)

    assert Enum.count(found) == 0
  end

  test "orders stories by position in states", %{project: project} do
    old = create_in_state(project.id, "ready")
    new = create_in_state(project.id, "ready")

    [found1, found2] = find_in_state(project.id, "ready")

    assert found1.id == new.id
    assert found2.id == old.id
  end

  test "moving to same state same index is a no-op", %{project: project} do
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(first.id, "working", 0)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == second.id
  end

  test "moves a story to an empty state", %{project: project} do
    story = create_in_state(project.id, "ready")

    {:ok, _} = Stories.move(story.id, "working", 0)
    [found1] = find_in_state(project.id, "working")

    assert found1.id == story.id
  end

  test "moves a story to bottom", %{project: project} do
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(first.id, "working", 1)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to top", %{project: project} do
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(second.id, "working", 0)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to middle", %{project: project} do
    third = create_in_state(project.id, "working")
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(first.id, "working", 1)
    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
    assert found3.id == third.id

    assert found1.position != found2.position
  end

  test "moves a story to the bottom of a different state", %{project: project} do
    story = create_in_state(project.id, "ready")
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(story.id, "working", 2)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == second.id
    assert found3.id == story.id
  end

  test "moves a story to the top of a different state", %{project: project} do
    story = create_in_state(project.id, "ready")
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(story.id, "working", 0)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == story.id
    assert found2.id == first.id
    assert found3.id == second.id
  end

  test "moves a story to the middle of a different state", %{project: project} do
    story = create_in_state(project.id, "ready")
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(story.id, "working", 1)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == story.id
    assert found3.id == second.id
  end

  test "indexing into very large numbers just goes to the end", %{project: project} do
    ready = create_in_state(project.id, "ready")
    working  = create_in_state(project.id, "working")

    {:ok, _} = Stories.move(ready.id, "working", 100)

    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == working.id
    assert found2.id == ready.id
  end
end
