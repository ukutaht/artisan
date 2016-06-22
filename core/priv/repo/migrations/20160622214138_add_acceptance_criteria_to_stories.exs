defmodule Artisan.Repo.Migrations.AddAcceptanceCriteriaToStories do
  use Ecto.Migration

  def change do
    alter table(:stories) do
      add :acceptance_criteria, :text, null: false, default: ""
    end
  end
end
