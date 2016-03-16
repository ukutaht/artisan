defmodule Artisan.Repo.Migrations.AddCompletedInToStories do
  use Ecto.Migration

  def change do
    alter table(:stories) do
      add :completed_in, references(:iterations)
    end
  end
end
