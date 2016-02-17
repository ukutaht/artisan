defmodule Artisan.StoryController do
  use Artisan.Web, :controller
  alias Artisan.Repo
  alias Artisan.Story

  def all(conn, _params) do
    stories = Repo.all(Artisan.Story)

    render(conn, "all.json", %{stories: stories})
  end

  def create(conn, %{"story" => story}) do
    nr = Repo.aggregate(Story, :count, :id)
    story = Story.changeset(%Story{number: nr + 1}, story)

    case story |> Repo.insert do
      {:ok, created} ->
        conn |> render("one.json", %{story: created})
      {:error, err} ->
        conn |> put_status(400) |> render("errors.json", %{errors: err})
    end
  end
end
