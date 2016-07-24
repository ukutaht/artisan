defmodule Artisan.Users.View do
  use Phoenix.View, root: ""

  @fields [:id, :name, :email, :avatar]

  def render("authenticated.json", %{user: user, token: token}) do
    %{
      user: render("user.json", user: user),
      token: token
    }
  end

  def render("user.json", %{user: user}) do
    Map.take(user, @fields)
  end

  def render("invalid.json", %{user: user}) do
    Artisan.ErrorHelper.serialize_errors(user)
  end
end
