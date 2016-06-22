defmodule Artisan.Repo.Migrations.AddUniqueIndexForStoryNumber do
  use Ecto.Migration

  def change do
    create unique_index(:stories, [:project_id, :number])
  end
end
