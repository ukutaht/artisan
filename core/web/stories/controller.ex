defmodule Artisan.Stories.Controller do
  use Artisan.Web, :controller
  alias Artisan.Stories

  def create(conn, %{"story" => story_params}) do
    case Stories.create(story_params["project_id"], story_params) do
      {:ok, created} ->
        broadcast(created.project_id, "add:story", Phoenix.View.render(Artisan.Stories.View, "story.json", story: created))
        conn |> render("story.json", story: created)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def update(conn, %{"story" => story_params, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.update(numeric_id, story_params) do
      {:ok, updated} ->
        broadcast(updated.project_id, "update:story", Phoenix.View.render(Artisan.Stories.View, "story.json", story: updated))
        conn |> render("story.json", story: updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def move(conn, %{"state" => state, "index" => index, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.move(numeric_id, state, index) do
      {:ok, project_id, updated} ->
        broadcast(project_id, "move:story", Phoenix.View.render(Artisan.Stories.View, "by_state.json", stories: updated))
        conn |> render("by_state.json", stories: updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  defp broadcast(project_id, event, payload) do
    Artisan.Endpoint.broadcast!("boards:#{project_id}", event, payload)
  end

  defp invalid(conn, %{errors: errors}) do
    conn |> put_status(400) |> json(%{errors: Enum.into(errors, %{})})
  end
end
