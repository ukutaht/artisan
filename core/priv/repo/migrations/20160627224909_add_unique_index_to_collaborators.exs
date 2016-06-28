defmodule Artisan.Repo.Migrations.AddUniqueIndexToCollaborators do
  use Ecto.Migration

  def change do
    create unique_index(:project_users, [:project_id, :user_id])
  end
end
