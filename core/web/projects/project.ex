defmodule Artisan.Project do
  use Ecto.Schema
  import Ecto.Changeset

  schema "projects" do
    field :name
    many_to_many :collaborators, Artisan.User, join_through: "project_users"

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
