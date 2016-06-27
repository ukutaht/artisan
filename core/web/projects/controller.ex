defmodule Artisan.Projects.Controller do
  use Artisan.Web, :controller
  alias Artisan.Projects

  def create(conn, %{"project" => project_params}) do
    case Projects.create(conn.assigns[:current_user], project_params) do
      {:ok, created} ->
        conn |> render("project.json", project: created)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def all(conn, _params) do
    conn |> render("projects.json", projects: Projects.all(conn.assigns[:current_user]))
  end

  def find(conn, %{"id" => id}) do
    {numeric_id, ""} = Integer.parse(id)
    project = Projects.find(conn.assigns[:current_user], numeric_id)
    if project do
      conn |> render("project.json", project: project)
    else
      not_found(conn)
    end
  end

  def update(conn, %{"id" => id, "project" => project_params}) do
    {numeric_id, ""} = Integer.parse(id)
    case Projects.update(conn.assigns[:current_user], numeric_id, project_params) do
      {:ok, updated} ->
        conn |> render("project.json", project: updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  defp not_found(conn) do
    conn |> put_status(404) |> json(%{error: "Not found"})
  end

  defp invalid(conn, project) do
    conn |> put_status(400) |> render("invalid.json", %{project: project})
  end
end
