defmodule Artisan.Repo.Migrations.Collapsed do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string, null: false
      add :slug, :string, null: false

      timestamps
    end
    create unique_index(:projects, [:slug])

    create table(:iterations) do
      add :number, :integer, null: false
      add :state, :string, null: false
      add :project_id, references(:projects), null: false

      timestamps
    end
    create index(:iterations, [:project_id])

    create table(:users) do
      add :name, :string, null: false
      add :email, :string, null: false
      add :password_hash, :string, null: false
      add :avatar, :string

      timestamps
    end
    create unique_index(:users, [:email])

    create table(:collaborators) do
      add :project_id, references(:projects)
      add :user_id, references(:users)

      timestamps
    end
    create unique_index(:collaborators, [:project_id, :user_id])

    create table(:stories) do
      add :name, :string, null: false
      add :acceptance_criteria, :text, null: false, default: ""
      add :state, :string, null: false
      add :number, :integer, null: false
      add :estimate, :float
      add :optimistic, :integer
      add :realistic, :integer
      add :pessimistic, :integer
      add :position, :integer, null: false
      add :tags, {:array, :string}, null: false, default: []
      add :project_id, references(:projects), null: false
      add :completed_in, references(:iterations)
      add :creator_id, references(:users), null: false
      add :assignee_id, references(:users)

      timestamps
    end
    create index(:stories, [:project_id])
    create unique_index(:stories, [:project_id, :number])
  end
end
