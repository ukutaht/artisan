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

  @iteration %{
    number: 1,
    state: "working"
  }

  def create_iteration(project_id, extra_params \\ []) do
    params = Map.merge(@iteration, Enum.into(extra_params, %{project_id: project_id}))
    {:ok, iteration} = Repo.insert(struct(Artisan.Iteration, params))
    iteration
  end

  @user %{
    name: "User",
    email: "user@email.com",
    password_hash: "hashed-pw"
  }

  def create_user(extra_params \\ []) do
    params = Map.merge(@user, Enum.into(extra_params, %{}))
    {:ok, user} = Repo.insert(struct(Artisan.User, params))
    user
  end
end
