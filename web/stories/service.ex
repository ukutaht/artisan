defmodule Artisan.Stories do
  use Artisan.Web, :model
  alias Artisan.Story

  def create(attrs) do
    shift_positions(from s in Story)

    %Story{number: count() + 1, position: 0}
      |> Story.changeset(attrs)
      |> Repo.insert
  end

  def update(id, attrs) do
    Repo.get(Story, id)
      |> Story.changeset(attrs)
      |> Repo.update
  end

  def count do
    Repo.aggregate(Story, :count, :id)
  end

  def shift_positions(query) do
    Repo.update_all(query, inc: [position: 1])
  end
end
