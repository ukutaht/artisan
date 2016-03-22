defmodule Artisan.Iteration do
  use Ecto.Schema
  import Ecto.Changeset

  schema "iterations" do
    field :number, :integer
    field :state, :string
    field :project_id, :integer

    timestamps
  end

  def changeset(iteration, attributes) do
    iteration
    |> cast(attributes, [:number, :state, :project_id])
    |> validate_required([:number, :state, :project_id])
  end
end
