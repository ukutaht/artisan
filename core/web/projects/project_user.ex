defmodule Artisan.ProjectUser do
  use Ecto.Schema
  import Ecto.Changeset

  schema "project_users" do
    field :project_id, :integer
    field :user_id, :integer

    timestamps
  end
end
