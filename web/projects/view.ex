defmodule Artisan.Projects.View do
  use Phoenix.View, root: ""

  @fields [:id, :name, :slug]

  def render("project.json", %{project: project}) do
    Map.take(project, @fields)
      |> assoc_collaborators(project)
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
    Enum.map(users, fn(user) -> Artisan.Users.View.render("user.json", user: user) end)
  end

  defp assoc_collaborators(map, project) do
    case project.collaborators do
      %Ecto.Association.NotLoaded{} -> map
      users -> Map.put(map, :collaborators, render("collaborators.json", %{users: users}))
    end
  end
end
