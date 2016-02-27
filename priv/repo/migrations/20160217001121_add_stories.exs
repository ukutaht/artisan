defmodule Artisan.Repo.Migrations.AddStories do
  use Ecto.Migration

  def change do
    create table(:stories) do
      add :name, :string, null: false
      add :state, :string, null: false
      add :number, :integer, null: false
      add :estimate, :float
      add :optimistic, :integer
      add :realistic, :integer
      add :pessimistic, :integer
      add :position, :integer, null: false
      add :tags, {:array, :string}, null: false, default: []

      timestamps
    end
  end
end
