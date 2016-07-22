defmodule Artisan.Repo.Migrations.AddSlugToProjects do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :slug, :string, null: false
    end

    create unique_index(:projects, [:slug])
  end
end
