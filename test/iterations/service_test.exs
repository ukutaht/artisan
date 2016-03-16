defmodule Artisan.IterationsTest do
  use Artisan.ModelCase
  alias Artisan.Iterations
  alias Artisan.Iteration

  setup do
    {:ok, project} = Repo.insert(%Artisan.Project{name: "project"})
    {:ok, %{project: project}}
  end

  test "creates an iteration for a project", %{project: project} do
    {:ok, _} = Iterations.create_for(project.id)

    assert Repo.aggregate(Iteration, :count, :id) == 1
  end

  test "iterations start out in planning state", %{project: project} do
    {:ok, created} = Iterations.create_for(project.id)

    assert created.state == "planning"
  end

  test "auto-increments the iteration number", %{project: project} do
    {:ok, first} = Iterations.create_for(project.id)
    {:ok, second} = Iterations.create_for(project.id)

    assert first.number == 1
    assert second.number == 2
  end

  test "completes an iteration", %{project: project} do
    {:ok, created} = Iterations.create_for(project.id)
    {:ok, updated} = Iterations.complete(created.id)

    assert updated.state == "completed"
  end

  test "starts an iteration", %{project: project} do
    {:ok, created} = Iterations.create_for(project.id)
    {:ok, updated} = Iterations.start(created.id)

    assert updated.state == "working"
  end

  test "gets current iteration for project", %{project: project} do
    {:ok, first} = Iterations.create_for(project.id)
    Iterations.complete(first.id)
    {:ok, second} = Iterations.create_for(project.id)

    %{iteration: current} = Iterations.current(project.id)

    assert current.id == second.id
  end

  test "incomplete iteration includes incomplete stories", %{project: project} do
    Iterations.create_for(project.id)
    Artisan.Stories.create(project.id, %{name: "name", state: "ready"})

    %{stories: %{"ready" => ready}} = Iterations.current(project.id)

    assert Enum.count(ready) == 1
  end

  test "incomplete iteration includes completed stories", %{project: project} do
    Iterations.create_for(project.id)
    Artisan.Stories.create(project.id, %{name: "name", state: "completed"})

    %{stories: %{"completed" => completed}} = Iterations.current(project.id)

    assert Enum.count(completed) == 1
  end
end
