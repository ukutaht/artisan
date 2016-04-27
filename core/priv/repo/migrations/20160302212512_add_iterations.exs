defmodule Artisan.Repo.Migrations.AddIterations do
  use Ecto.Migration

  def change do
    create table(:iterations) do
      add :number, :integer, null: false
      add :state, :string, null: false
      add :project_id, references(:projects), null: false

      timestamps
    end

    create index(:iterations, [:project_id])
  end
end
