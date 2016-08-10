defmodule Artisan.Stories.Controller do
  use Phoenix.Controller
  alias Artisan.Stories
  alias Artisan.Projects.Channel

  def create(conn, %{"story" => story_params}) do
    case Stories.create(conn.assigns[:current_user], story_params["project_id"], story_params) do
      {:ok, created} ->
        view = Phoenix.View.render(Stories.View, "story.json", story: created)
        Channel.broadcast(created.project_id, "story:add", view)
        conn |> json(view)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def update(conn, %{"story" => story_params, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.update(numeric_id, story_params) do
      {:ok, updated} ->
        view = Phoenix.View.render(Stories.View, "story.json", story: updated)
        Channel.broadcast(updated.project_id, "story:update", view)
        conn |> json(view)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def move(conn, %{"state" => state, "index" => index, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)
    user_id = conn.assigns[:current_user]

    case Stories.move(numeric_id, user_id, state, index) do
      {:ok, updated, from, to} ->
        view = Phoenix.View.render(Stories.View, "move.json", story: updated, from: from, to: to, index: index)
        Channel.broadcast(updated.project_id, "story:move", view)
        conn |> json(view)
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
