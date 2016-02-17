defmodule Artisan.Stories do
  use Artisan.Web, :model
  alias Artisan.Story

  def create(attrs) do
    %Story{number: count() + 1}
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
end
