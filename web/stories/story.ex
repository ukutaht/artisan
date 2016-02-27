defmodule Artisan.Story do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Poison.Encoder, only: [:id, :project_id, :name, :state, :number, :estimate, :optimistic, :realistic, :pessimistic, :position, :tags]}

  schema "stories" do
    field :name
    field :state
    field :number, :integer
    field :estimate, :float
    field :optimistic, :integer
    field :realistic, :integer
    field :pessimistic, :integer
    field :position, :integer
    field :tags, {:array, :string}, default: []
    field :project_id, :integer

    timestamps
  end

  def changeset(story, attributes) do
    story
    |> cast(attributes, [:project_id, :name, :estimate, :optimistic, :realistic, :pessimistic, :tags, :state])
    |> validate_required([:name])
  end

  def change_position(story, position) do
    story
    |> cast(%{position: position}, [:position])
  end
end
