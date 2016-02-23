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

  def count do
    Repo.aggregate(Project, :count, :id)
  end

  test "creates a project with valid params" do
    {:ok, _} = Projects.create(@valid_project_params)

    assert count() == 1
  end

  test "does not create a project with invalid params" do
    {:error, _} = Projects.create(@invalid_project_params)

    assert count() == 0
  end
end

