defmodule Artisan.Projects do
  use Artisan.Web, :model
  alias Artisan.Project
  alias Artisan.ProjectUser
  alias Artisan.Iterations
  alias Artisan.User
  alias Artisan.Projects.Slug

  def create(user_id, params) do
    %Project{}
      |> Project.new(params)
      |> generate_slug
      |> Repo.insert
      |> create_first_iteration
      |> add_as_collaborator(user_id)
  end

  def all(user_id) do
    Repo.all(projects_for(user_id))
  end

  def find(user_id, slug) do
    Repo.one(from p in projects_for(user_id),
     where: p.slug == ^slug,
     preload: :collaborators
    )
  end

  def remove_collaborator(project_id, user_id) do
    Repo.delete_all(from pu in ProjectUser,
     where: pu.user_id == ^user_id,
     where: pu.project_id == ^project_id
    )
    :ok
  end

  def add_collaborator(project_id, collaborator_id) do
    {:ok, _} = Repo.insert(%ProjectUser{project_id: project_id, user_id: collaborator_id})
    :ok
  end

  def autocomplete_collaborators(project_id, query) do
    query = "%#{query}%"

    Repo.all(from u in User,
     left_join: pu in ProjectUser, on: u.id == pu.user_id and pu.project_id == ^project_id,
     where: is_nil(pu.user_id),
     where: ilike(u.name, ^query) or ilike(u.email, ^query),
     limit: 10,
     select: u
    )
  end

  def update(user_id, project_id, attrs) do
    project = Repo.one(from p in projects_for(user_id),
     where: p.id == ^project_id,
     preload: :collaborators
    )

    project |> do_edit(attrs)
  end

  def is_collaborator?(project_id, user_id) do
    query = from(pu in ProjectUser,
      where: pu.project_id == ^project_id,
      where: pu.user_id == ^user_id
    )

    Repo.aggregate(query, :count, :id) > 0
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
    from(p in Project,
      join: pu in ProjectUser, on: pu.project_id == p.id,
      where: pu.user_id == ^user_id,
      select: p
    )
  end

  defp generate_slug(%{errors: []} = changeset) do
    Project.add_slug(changeset, Slug.generate(changeset.changes.name))
  end
  defp generate_slug(changeset_with_error), do: changeset_with_error
end

