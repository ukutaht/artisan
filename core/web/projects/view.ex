defmodule Artisan.Projects.View do
  use Artisan.Web, :view

  @fields [:id, :name]

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
end
