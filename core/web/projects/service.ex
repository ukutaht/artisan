defmodule Artisan.Projects do
  use Artisan.Web, :model
  alias Artisan.Project
  alias Artisan.ProjectUser
  alias Artisan.Iterations
  alias Artisan.User

  def create(user_id, params) do
    %Project{}
      |> Project.new(params)
      |> Repo.insert
      |> create_first_iteration
      |> add_as_collaborator(user_id)
  end

  def all(user_id) do
    Repo.all(projects_for(user_id))
  end

  def find(user_id, project_id) do
    Repo.one(from p in projects_for(user_id),
     where: p.project_id == ^project_id
    )
  end

  def collaborators(project_id) do
    Repo.all(from pu in ProjectUser,
     join: u in User,
     where: pu.user_id == u.id,
     where: pu.project_id == ^project_id,
     select: u
    )
  end

  def remove_collaborator(project_id, user_id) do
    Repo.delete_all(from pu in ProjectUser,
     where: pu.user_id == ^user_id,
     where: pu.project_id == ^project_id
    )
    :ok
  end

  def update(user_id, project_id, attrs) do
    find(user_id, project_id) |> do_edit(attrs)
  end

  defp create_first_iteration({:ok, project}) do
    {:ok, _} = Iterations.create_for(project.id)
    {:ok, project}
  end
  defp create_first_iteration(error), do: error

  defp add_as_collaborator({:ok, project}, user_id) do
    {:ok, _} = Repo.insert(%ProjectUser{project_id: project.id, user_id: user_id})
    {:ok, project}
  end
  defp add_as_collaborator(error, _), do: error

  defp do_edit(nil, _), do: {:error, "Not Found"}
  defp do_edit(project, attrs) do
    project
      |> Project.edit(attrs)
      |> Repo.update
  end

  defp projects_for(user_id) do
    from(pu in ProjectUser,
      join: p in Project,
      where: pu.user_id == ^user_id,
      where: pu.project_id == p.id,
      select: p
    )
  end
end

