defmodule Artisan.Repo.Migrations.AddCreatorIdToStories do
  use Ecto.Migration

  def change do
    alter table(:stories) do
      add :creator_id, references(:users), null: false
    end
  end
end
