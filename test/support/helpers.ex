defmodule Artisan.Test.Helpers do
  use Artisan.Repo

  @project %{
    name: "Project",
    slug: "slug"
  }

  def create_project(extra_params \\ []) do
    params = Map.merge(@project, Enum.into(extra_params, %{}))
    {:ok, project} = Repo.insert(struct(Artisan.Project, params))
    project
  end
end
