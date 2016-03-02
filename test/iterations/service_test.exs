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

  test "auto-increments the iteration number", %{project: project} do
    {:ok, first} = Iterations.create_for(project.id)
    {:ok, second} = Iterations.create_for(project.id)
    {:ok, third} = Iterations.create_for(project.id)

    assert first.number == 1
    assert second.number == 2
    assert third.number == 3
  end
end
