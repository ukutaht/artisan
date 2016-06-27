defmodule Artisan.Projects.View do
  use Artisan.Web, :view

  @fields [:id, :name]
  @user_fields [:id, :email, :name]

  def render("project.json", %{project: project}) do
    Map.take(project, @fields)
  end

  def render("projects.json", %{projects: projects}) do
    Enum.map(projects, fn(project) ->
      render("project.json", project: project)
    end)
  end

  def render("invalid.json", %{project: project}) do
    Artisan.ErrorHelper.serialize_errors(project)
  end

  def render("collaborators.json", %{users: users}) do
    Enum.map(users, fn(user) -> Map.take(user, @user_fields) end)
  end
end
