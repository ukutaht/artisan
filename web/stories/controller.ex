defmodule Artisan.Stories.Controller do
  use Artisan.Web, :controller
  alias Artisan.Repo
  alias Artisan.Stories

  def all(conn, _params) do
    stories = Repo.all(Artisan.Story)

    render(conn, "all.json", %{stories: stories})
  end

  def create(conn, %{"story" => story_params}) do
    case Stories.create(story_params) do
      {:ok, created} ->
        conn |> render("one.json", %{story: created})
      {:error, changeset} ->
        conn |> put_status(400) |> render("errors.json", changeset)
    end
  end

  def update(conn, %{"story" => story_params, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.update(numeric_id, story_params) do
      {:ok, updated} ->
        conn |> render("one.json", %{story: updated})
      {:error, changeset} ->
        conn |> put_status(400) |> render("errors.json", changeset)
    end
  end

  def move(conn, %{"state" => state, "index" => index, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)

    case Stories.move(numeric_id, state, index) do
      {:ok, updated} ->
        conn |> render("one.json", %{story: updated})
      {:error, changeset} ->
        conn |> put_status(400) |> render("errors.json", changeset)
    end
  end
end
