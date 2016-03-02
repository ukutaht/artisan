defmodule Artisan.Iteration do
  use Ecto.Schema

  @derive {Poison.Encoder, only: [:id, :project_id, :number]}

  schema "iterations" do
    field :number, :integer
    field :project_id, :integer

    timestamps
  end
end
