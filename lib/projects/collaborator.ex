defmodule Artisan.Collaborator do
  use Ecto.Schema

  schema "collaborators" do
    field :project_id, :integer
    field :user_id, :integer

    timestamps
  end
end
