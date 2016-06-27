defmodule Artisan.Repo.Migrations.AddProjectUsers do
  use Ecto.Migration

  def change do
    create table(:project_users) do
      add :project_id, references(:projects)
      add :user_id, references(:users)

      timestamps
    end
  end
end
