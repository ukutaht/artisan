defmodule Artisan.Projects do
  use Artisan.Web, :model
  alias Artisan.Project
  alias Artisan.Iterations

  def create(params) do
    %Project{}
      |> Project.changeset(params)
      |> Repo.insert
      |> create_first_iteration
  end

  def all do
    Repo.all(Project)
  end

  defp create_first_iteration({:ok, project}) do
    {:ok, _} = Iterations.create_for(project.id)
    {:ok, project}
  end

  defp create_first_iteration(error), do: error
end

