defmodule Artisan.Story do
  use Ecto.Schema
  import Ecto.Changeset

  schema "stories" do
    field :name
    field :state
    field :acceptance_criteria, :string, default: ""
    field :number, :integer
    field :estimate, :float
    field :optimistic, :integer
    field :realistic, :integer
    field :pessimistic, :integer
    field :position, :integer
    field :tags, {:array, :string}, default: []
    field :project_id, :integer
    field :completed_in, :integer
    belongs_to :creator, Artisan.User
    belongs_to :assignee, Artisan.User

    timestamps
  end

  def new(story, attributes) do
    story
    |> cast(attributes, [:name, :acceptance_criteria, :estimate, :optimistic, :realistic, :pessimistic, :tags, :state, :assignee_id])
    |> validate_required([:name, :project_id, :creator_id])
  end

  def edit(story, attributes) do
    story
    |> cast(attributes, [:name, :acceptance_criteria, :estimate, :optimistic, :realistic, :pessimistic, :tags, :assignee_id])
    |> validate_required([:name])
  end

  def change_position(story, state, position) do
    story
    |> cast(%{position: position, state: state}, [:position, :state])
  end

  def assign(story, assignee_id) do
    story
    |> cast(%{assignee_id: assignee_id}, [:assignee_id])
  end
end
