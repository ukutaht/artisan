defmodule Artisan.Repo.Migrations.AddAssigneeIdToStories do
  use Ecto.Migration

  def change do
    alter table(:stories) do
      add :assignee_id, references(:users)
    end
  end
end
