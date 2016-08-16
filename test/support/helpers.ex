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

  @story %{
    name: "name",
    state: "ready",
    position: 0
  }

  def create_story(project_id, user_id, extra_params \\ []) do
    params = Map.merge(@story, Enum.into(extra_params, %{
       project_id: project_id,
       creator_id: user_id,
       number: next_number(project_id)
     }))

    {:ok, story} = Repo.insert(struct(Artisan.Story, params))
    story
  end

  defp next_number(project_id) do
    q = from(s in Artisan.Story, where: s.project_id == ^project_id)
    (Repo.aggregate(q, :max, :number) || 0) + 1
  end
end
