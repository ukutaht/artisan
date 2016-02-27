defmodule Artisan.Repo.Migrations.AddProjectIdToStories do
  use Ecto.Migration

  def change do
    alter table(:stories) do
      add :project_id, references(:projects), null: false
    end

    create index(:stories, [:project_id])
  end
end
