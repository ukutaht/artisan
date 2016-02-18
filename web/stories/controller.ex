defmodule Artisan.Stories.Controller do
  use Artisan.Web, :controller
  alias Artisan.Stories

  def by_state(conn, _params) do
    conn |> json(Stories.by_state())
  end

  def create(conn, %{"story" => story_params}) do
    case Stories.create(story_params) do
      {:ok, created} ->
        conn |> json(created)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def update(conn, %{"story" => story_params, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.update(numeric_id, story_params) do
      {:ok, updated} ->
        conn |> json(updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def move(conn, %{"state" => state, "index" => index, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.move(numeric_id, state, index) do
      {:ok, updated} ->
        conn |> json(updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  defp invalid(conn, %{errors: errors}) do
    conn |> put_status(400) |> json(%{errors: Enum.into(errors, %{})})
  end
end
