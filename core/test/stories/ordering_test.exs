defmodule Artisan.Stories.OrderingTest do
  use Artisan.ModelCase
  alias Artisan.Stories
  alias Artisan.Stories.Ordering

  @story_params %{
    name: "name",
    state: "ready",
  }

  setup do
    {:ok, project} = Repo.insert(%Artisan.Project{name: "project"})
    {:ok, %{project: project}}
  end

  def create_in_state(project_id, state) do
    {:ok, created} = Stories.create(project_id, %{@story_params | state: state})
    created
  end

  def find_in_state(project_id, state) do
    Stories.by_state(project_id)[state]
  end

  test "moving to same state same index is a no-op", %{project: project} do
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Ordering.move(first.id, "working", 0)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == second.id
  end

  test "moves a story to an empty state", %{project: project} do
    story = create_in_state(project.id, "ready")

    {:ok, _} = Ordering.move(story.id, "working", 0)
    [found1] = find_in_state(project.id, "working")

    assert found1.id == story.id
  end

  test "moves a story to bottom", %{project: project} do
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Ordering.move(first.id, "working", 1)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to top", %{project: project} do
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Ordering.move(second.id, "working", 0)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to middle", %{project: project} do
    third = create_in_state(project.id, "working")
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Ordering.move(first.id, "working", 1)
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

    {:ok, _} = Ordering.move(story.id, "working", 2)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == second.id
    assert found3.id == story.id
  end

  test "moves a story to the top of a different state", %{project: project} do
    story = create_in_state(project.id, "ready")
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Ordering.move(story.id, "working", 0)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == story.id
    assert found2.id == first.id
    assert found3.id == second.id
  end

  test "moves a story to the middle of a different state", %{project: project} do
    story = create_in_state(project.id, "ready")
    second = create_in_state(project.id, "working")
    first  = create_in_state(project.id, "working")

    {:ok, _} = Ordering.move(story.id, "working", 1)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == story.id
    assert found3.id == second.id
  end

  test "moves a story only within the project", %{project: project} do
    {:ok, project2} = Repo.insert(%Artisan.Project{name: "project"})

    second = create_in_state(project.id, "ready")
    first = create_in_state(project.id, "ready")

    create_in_state(project2.id, "ready")

    {:ok, _} = Ordering.move(first.id, "ready", 1)

    [found1, found2] = find_in_state(project.id, "ready")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "indexing into very large numbers just goes to the end", %{project: project} do
    ready = create_in_state(project.id, "ready")
    working  = create_in_state(project.id, "working")

    {:ok, _} = Ordering.move(ready.id, "working", 100)

    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == working.id
    assert found2.id == ready.id
  end
end
