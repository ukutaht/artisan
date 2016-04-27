defmodule Artisan.ProjectsTest do
  use Artisan.ModelCase
  alias Artisan.Projects
  alias Artisan.Project

  @valid_project_params %{
    name: "name",
  }

  @invalid_project_params %{
    name: nil
  }

  test "creates a project with valid params" do
    {:ok, _} = Projects.create(@valid_project_params)

    assert Repo.aggregate(Project, :count, :id) == 1
  end

  test "automatically creates the first iteration when creating project" do
    {:ok, _} = Projects.create(@valid_project_params)

    assert Repo.aggregate(Artisan.Iteration, :count, :id) == 1
  end

  test "does not create a project with invalid params" do
    {:error, _} = Projects.create(@invalid_project_params)

    assert Repo.aggregate(Project, :count, :id) == 0
  end
end

