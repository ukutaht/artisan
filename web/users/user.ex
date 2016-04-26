defmodule Artisan.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name
    field :email
    field :password_hash
    field :password, :string, virtual: true

    timestamps
  end

  def changeset(user, attributes) do
    user
    |> cast(attributes, [:name, :email])
    |> validate_required([:name, :email])
  end

  def set_password(user, password, hash) do
    user
    |> cast(%{password: password}, [:password])
    |> validate_required(:password)
    |> validate_length(:password, min: 6)
    |> cast(%{password_hash: hash}, [:password_hash])
  end
end
