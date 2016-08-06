defmodule Artisan.Project do
  use Ecto.Schema
  import Ecto.Changeset
  @slug_format ~r/^[a-z0-9-]+$/

  schema "projects" do
    field :name
    field :slug
    many_to_many :collaborators, Artisan.User, join_through: "collaborators"

    timestamps
  end

  def new(project, attributes) do
    project
    |> cast(attributes, [:name])
    |> validate_required([:name])
  end

  def add_slug(project, slug) do
    project
    |> cast(%{slug: slug}, [:slug])
    |> validate_required([:slug])
    |> validate_format(:slug, @slug_format)
    |> unique_constraint(:slug)
  end

  def edit(project, attributes) do
    project
    |> cast(attributes, [:name, :slug])
    |> validate_required([:name, :slug])
    |> validate_format(:slug, @slug_format)
    |> unique_constraint(:slug)
  end
end
