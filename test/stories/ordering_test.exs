defmodule Artisan.Stories.OrderingTest do
  use Artisan.ModelCase
  alias Artisan.Stories
  alias Artisan.Stories.Ordering

  @story_params %{
    name: "name",
    state: "ready",
  }

  setup do
    project = Helpers.create_project()
    user = Helpers.create_user()
    {:ok, %{user: user, project: project}}
  end

  def create_in_state(user_id, project_id, state) do
    {:ok, created} = Stories.create(user_id, project_id, %{@story_params | state: state})
    created
  end

  def find_in_state(project_id, state) do
    Stories.by_state(project_id)[state]
  end

  test "moving to same state same index is a no-op", %{user: user, project: project} do
    second = create_in_state(user.id, project.id, "working")
    first  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(first.id, user.id, "working", 0)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == second.id
  end

  test "moves a story to an empty state", %{user: user, project: project} do
    story = create_in_state(user.id, project.id, "ready")

    {:ok, _} = Ordering.move(story.id, user.id, "working", 0)
    [found1] = find_in_state(project.id, "working")

    assert found1.id == story.id
  end

  test "moves a story to bottom", %{user: user, project: project} do
    second = create_in_state(user.id, project.id, "working")
    first  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(first.id, user.id, "working", 1)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to top", %{user: user, project: project} do
    second = create_in_state(user.id, project.id, "working")
    first  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(second.id, user.id, "working", 0)
    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "moves a story to middle", %{user: user, project: project} do
    third = create_in_state(user.id, project.id, "working")
    second = create_in_state(user.id, project.id, "working")
    first  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(first.id, user.id, "working", 1)
    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == second.id
    assert found2.id == first.id
    assert found3.id == third.id

    assert found1.position != found2.position
  end

  test "moves a story to the bottom of a different state", %{user: user, project: project} do
    story = create_in_state(user.id, project.id, "ready")
    second = create_in_state(user.id, project.id, "working")
    first  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(story.id, user.id, "working", 2)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == second.id
    assert found3.id == story.id
  end

  test "moves a story to the top of a different state", %{user: user, project: project} do
    story = create_in_state(user.id, project.id, "ready")
    second = create_in_state(user.id, project.id, "working")
    first  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(story.id, user.id, "working", 0)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == story.id
    assert found2.id == first.id
    assert found3.id == second.id
  end

  test "moves a story to the middle of a different state", %{user: user, project: project} do
    story = create_in_state(user.id, project.id, "ready")
    second = create_in_state(user.id, project.id, "working")
    first  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(story.id, user.id, "working", 1)

    [found1, found2, found3] = find_in_state(project.id, "working")

    assert found1.id == first.id
    assert found2.id == story.id
    assert found3.id == second.id
  end

  test "moves a story only within the project", %{user: user, project: project} do
    {:ok, project2} = Repo.insert(%Artisan.Project{name: "project", slug: "slug2"})

    second = create_in_state(user.id, project.id, "ready")
    first = create_in_state(user.id, project.id, "ready")

    create_in_state(user.id, project2.id, "ready")

    {:ok, _} = Ordering.move(first.id, user.id, "ready", 1)

    [found1, found2] = find_in_state(project.id, "ready")

    assert found1.id == second.id
    assert found2.id == first.id
  end

  test "indexing into very large numbers just goes to the end", %{user: user, project: project} do
    ready = create_in_state(user.id, project.id, "ready")
    working  = create_in_state(user.id, project.id, "working")

    {:ok, _} = Ordering.move(ready.id, user.id, "working", 100)

    [found1, found2] = find_in_state(project.id, "working")

    assert found1.id == working.id
    assert found2.id == ready.id
  end

  test "moving unassigned story to working assigns user", %{user: user, project: project} do
    story = create_in_state(user.id, project.id, "ready")

    {:ok, updated} = Ordering.move(story.id, user.id, "working", 1)

    assert updated.assignee_id == user.id
  end

  test "moving unassigned story to completed assigns user", %{user: user, project: project} do
    story = create_in_state(user.id, project.id, "ready")

    {:ok, updated} = Ordering.move(story.id, user.id, "completed", 1)

    assert updated.assignee_id == user.id
  end

  test "moving unassigned story to ready or backlog does not assign user", %{user: user, project: project} do
    story = create_in_state(user.id, project.id, "ready")

    {:ok, updated1} = Ordering.move(story.id, user.id, "ready", 1)
    {:ok, updated2} = Ordering.move(story.id, user.id, "backlog", 1)

    assert updated1.assignee_id == nil
    assert updated2.assignee_id == nil
  end

  test "moving already assigned story does not autoassign at all", %{user: user, project: project} do
    {:ok, story} = Stories.create(user.id, project.id, Map.merge(@story_params, %{
       state: "working",
       assignee_id: user.id
     }))

    user2 = Helpers.create_user(email: "user2@email.com")

    {:ok, updated} = Ordering.move(story.id, user2.id, "completed", 1)

    assert updated.assignee_id == user.id
  end

  describe "moving completed stories" do
    test "moves a story to bottom", %{user: user, project: project} do
      second = create_in_state(user.id, project.id, "completed")
      first  = create_in_state(user.id, project.id, "completed")

      iteration = Helpers.create_iteration(project.id)
      Artisan.Iterations.complete(iteration.id)

      {:ok, _} = Ordering.move(first.id, user.id, "completed", 1)
      %{"completed" => [found1, found2]} = Stories.completed_in(iteration.id)

      assert found1.id == second.id
      assert found2.id == first.id
    end

    test "moves a story to top", %{user: user, project: project} do
      second = create_in_state(user.id, project.id, "completed")
      first  = create_in_state(user.id, project.id, "completed")

      iteration = Helpers.create_iteration(project.id)
      Artisan.Iterations.complete(iteration.id)

      {:ok, _} = Ordering.move(second.id, user.id, "completed", 0)
      %{"completed" => [found1, found2]} = Stories.completed_in(iteration.id)

      assert found1.id == second.id
      assert found2.id == first.id
    end
  end
end
