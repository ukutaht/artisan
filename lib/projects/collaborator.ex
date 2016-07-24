defmodule Artisan.Collaborator do
  use Ecto.Schema
  import Ecto.Changeset

  schema "collaborators" do
    field :project_id, :integer
    field :user_id, :integer

    timestamps
  end
end
