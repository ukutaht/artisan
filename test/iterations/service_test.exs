defmodule Artisan.IterationsTest do
  use Artisan.ModelCase
  alias Artisan.Iterations
  alias Artisan.Iteration
  alias Artisan.Test.Helpers

  setup do
    project = Helpers.create_project()
    user = Helpers.create_user()
    {:ok, %{project: project, user: user}}
  end

  def create_iteration(project_id) do
    {:ok, %{iteration: iteration}} = Iterations.create_for(project_id)
    iteration
  end

  describe "create" do
    test "creates an iteration for a project", %{project: project} do
      {:ok, _} = Iterations.create_for(project.id)

      assert Repo.aggregate(Iteration, :count, :id) == 1
    end

    test "does not create another iteration if there is one currently open", %{project: project} do
      {:ok, _} = Iterations.create_for(project.id)

      assert Iterations.create_for(project.id) == {:error, :active_iteration_exists}
    end

    test "iterations start out in planning state", %{project: project} do
      created = create_iteration(project.id)

      assert created.state == "planning"
    end

    test "auto-increments the iteration number", %{project: project} do
      first = create_iteration(project.id)
      Iterations.complete(first.id)
      second = create_iteration(project.id)

      assert first.number == 1
      assert second.number == 2
    end
  end

  test "completes an iteration", %{project: project} do
    created = create_iteration(project.id)
    {:ok, %{iteration: updated}} = Iterations.complete(created.id)

    assert updated.state == "completed"
  end

  test "stories are marked when completing iteration", %{user: user, project: project} do
    iteration = create_iteration(project.id)
    {:ok, completed} = Artisan.Stories.create(user.id, project.id, %{name: "name", state: "completed"})
    Iterations.complete(iteration.id)

    assert Repo.get(Artisan.Story, completed.id).completed_in == iteration.id
  end

  test "working stories are moved to ready when completing", %{user: user, project: project} do
    iteration = create_iteration(project.id)
    {:ok, working} = Artisan.Stories.create(user.id, project.id, %{name: "name", state: "working"})
    Iterations.complete(iteration.id)

    assert Repo.get(Artisan.Story, working.id).state == "ready"
  end

  test "starts an iteration", %{project: project} do
    created = create_iteration(project.id)
    {:ok, updated} = Iterations.start(created.id)

    assert updated.state == "working"
  end

  test "gets a specific iteration for project", %{project: project} do
    iteration = create_iteration(project.id)

    %{iteration: found} = Iterations.get(project.id, iteration.number)

    assert found.id == iteration.id
  end

  test "gets current iteration for project", %{project: project} do
    first = create_iteration(project.id)
    Iterations.complete(first.id)
    second = create_iteration(project.id)

    %{iteration: current} = Iterations.current(project.id)

    assert current.id == second.id
  end

  test "current is nil for a project that does not exist" do
    assert Iterations.current(-1) == nil
  end

  test "current iteration has all iterations", %{project: project} do
    first = create_iteration(project.id)
    Iterations.complete(first.id)
    second = create_iteration(project.id)

    %{all_iterations: all_iterations} = Iterations.current(project.id)

    all_iteration_ids = Enum.map(all_iterations, fn(i) -> i.id end)

    assert Enum.member?(all_iteration_ids, first.id)
    assert Enum.member?(all_iteration_ids, second.id)
  end

  test "all iterations do not include iterations for another project", %{project: project} do
    create_iteration(project.id)

    {:ok, project2} = Repo.insert(%Artisan.Project{name: "project", slug: "slug2"})

    another_project_iteration = create_iteration(project2.id)

    %{all_iterations: all_iterations} = Iterations.current(project.id)

    all_iteration_ids = Enum.map(all_iterations, fn(i) -> i.id end)

    refute Enum.member?(all_iteration_ids, another_project_iteration.id)
  end

  test "incomplete iteration includes incomplete stories", %{user: user, project: project} do
    create_iteration(project.id)
    Artisan.Stories.create(user.id, project.id, %{name: "name", state: "ready"})

    %{stories: %{"ready" => ready}} = Iterations.current(project.id)

    assert Enum.count(ready) == 1
  end

  test "incomplete iteration includes completed stories", %{user: user, project: project} do
    create_iteration(project.id)
    Artisan.Stories.create(user.id, project.id, %{name: "name", state: "completed"})

    %{stories: %{"completed" => completed}} = Iterations.current(project.id)

    assert Enum.count(completed) == 1
  end

  test "completed iteration only includes stories completed in that iteration", %{user: user, project: project} do
    iteration = create_iteration(project.id)
    Helpers.create_story(project.id, user.id, %{state: "completed"})
    Helpers.create_story(project.id, user.id, %{state: "working"})
    Iterations.complete(iteration.id)

    %{stories: stories} = Iterations.current(project.id)

    assert Enum.count(stories["completed"]) == 1
    assert stories["working"] == nil
  end

  describe "get_by_story" do
    test "finds current iteration if story is not completed", %{user: user, project: project} do
      current_iteration = create_iteration(project.id)
      story = Helpers.create_story(project.id, user.id, %{state: "working"})

      %{iteration: iteration} = Iterations.get_by_story(project.id, story.number)

      assert iteration.id == current_iteration.id
    end

    test "finds iteration if story has been completed", %{user: user, project: project} do
      completed_iteration = Helpers.create_iteration(project.id, %{state: "completed"})
      story = Helpers.create_story(project.id, user.id, %{state: "completed", completed_in: completed_iteration.id})

      %{iteration: iteration} = Iterations.get_by_story(project.id, story.number)

      assert iteration.id == completed_iteration.id
    end

    test "does not find iteration when story does not exist", %{project: project} do
      assert Iterations.get_by_story(project.id, -1) == nil
    end
  end
end
