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

  defp invalid(conn, %{errors: errors}) do
    conn |> put_status(400) |> json(%{errors: Enum.into(errors, %{})})
  end
end
