defmodule Artisan.Project do
  use Ecto.Schema
  import Ecto.Changeset

  schema "projects" do
    field :name

    timestamps
  end

  def new(project, attributes) do
    project
    |> cast(attributes, [:name])
    |> validate_required([:name])
  end

  def edit(project, attributes) do
    project
    |> cast(attributes, [:name])
    |> validate_required([:name])
  end
end
