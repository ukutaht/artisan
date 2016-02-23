defmodule Artisan.Project do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Poison.Encoder, only: [:id, :name]}

  schema "projects" do
    field :name

    timestamps
  end

  def changeset(project, attributes) do
    project
    |> cast(attributes, [:name])
    |> validate_required([:name])
  end
end
