defmodule Artisan.Stories.Controller do
  use Phoenix.Controller
  alias Artisan.Stories
  alias Artisan.Projects.Channel

  def create(conn, %{"story" => story_params}) do
    case Stories.create(conn.assigns[:current_user], story_params["project_id"], story_params) do
      {:ok, created} ->
        Channel.broadcast(created.project_id, "story:add", Phoenix.View.render(Artisan.Stories.View, "story.json", story: created))
        conn |> render("story.json", story: created)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def update(conn, %{"story" => story_params, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.update(numeric_id, story_params) do
      {:ok, updated} ->
        Channel.broadcast(updated.project_id, "story:update", Phoenix.View.render(Artisan.Stories.View, "story.json", story: updated))
        conn |> render("story.json", story: updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def move(conn, %{"state" => state, "index" => index, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)
    user_id = conn.assigns[:current_user]

    case Stories.move(numeric_id, user_id, state, index) do
      {:ok, project_id, updated} ->
        Channel.broadcast(project_id, "story:move", Phoenix.View.render(Artisan.Stories.View, "by_state.json", stories: updated))
        conn |> render("by_state.json", stories: updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def delete(conn, %{"id" => story_id}) do
    {numeric_id, _} = Integer.parse(story_id)

    case Stories.delete(numeric_id) do
      {:ok, _} ->
        conn |> json(%{})
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  defp invalid(conn, story) do
    conn |> put_status(400) |> render("invalid.json", story: story)
  end
end
