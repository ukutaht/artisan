defmodule Artisan.Projects.Controller do
  use Artisan.Web, :controller
  alias Artisan.Projects

  def create(conn, %{"project" => project_params}) do
    case Projects.create(project_params) do
      {:ok, created} ->
        conn |> render("project.json", project: created)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def all(conn, _params) do
    conn |> render("projects.json", projects: Projects.all)
  end

  def find(conn, %{"id" => id}) do
    {numeric_id, ""} = Integer.parse(id)
    conn |> render("project.json", project: Projects.find(numeric_id))
  end

  def update(conn, %{"id" => id, "project" => project_params}) do
    {numeric_id, ""} = Integer.parse(id)
    case Projects.update(numeric_id, project_params) do
      {:ok, updated} ->
        conn |> render("project.json", project: updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  defp invalid(conn, project) do
    conn |> put_status(400) |> render("invalid.json", %{project: project})
  end
end
