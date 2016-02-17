defmodule Artisan.Repo.Migrations.AddStories do
  use Ecto.Migration

  def change do
    create table(:stories) do
      add :name, :string
      add :state, :string
      add :number, :integer
      add :estimate, :float
      add :optimistic, :integer
      add :realistic, :integer
      add :pessimistic, :integer
      add :position, :integer
      add :tags, {:array, :string}

      timestamps
    end
  end
end
