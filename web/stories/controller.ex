defmodule Artisan.Stories.Controller do
  use Artisan.Web, :controller
  alias Artisan.Repo
  alias Artisan.Story

  def all(conn, _params) do
    stories = Repo.all(Artisan.Story)

    render(conn, "all.json", %{stories: stories})
  end

  def create(conn, %{"story" => story_params}) do
    nr = Repo.aggregate(Story, :count, :id)
    story = %Story{number: nr + 1} |> Story.changeset(story_params)

    case Repo.insert(story) do
      {:ok, created} ->
        conn |> render("one.json", %{story: created})
      {:error, err} ->
        conn |> put_status(400) |> render("errors.json", %{errors: err})
    end
  end

  def update(conn, %{"story" => story_params, "id" => id}) do
    {numeric_id, _} = Integer.parse(id)
    story = Repo.get(Story, numeric_id)
    changes = story |> Story.changeset(story_params)

    case Repo.update(changes) do
      {:ok, updated} ->
        conn |> render("one.json", %{story: updated})
      {:error, err} ->
        conn |> put_status(400) |> render("errors.json", %{errors: err})
    end
  end
end
