defmodule Artisan.Projects.Controller do
  use Artisan.Web, :controller
  alias Artisan.Projects

  def create(conn, %{"project" => project_params}) do
    case Projects.create(project_params) do
      {:ok, created} ->
        conn |> json(created)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  defp invalid(conn, %{errors: errors}) do
    conn |> put_status(400) |> json(%{errors: Enum.into(errors, %{})})
  end
end
