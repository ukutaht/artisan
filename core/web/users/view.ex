defmodule Artisan.Users.View do
  use Artisan.Web, :view

  @fields [:id, :name, :email]

  def render("authenticated.json", %{user: user, token: token}) do
    %{
      user: render("user.json", user: user),
      token: token
    }
  end

  def render("user.json", %{user: user}) do
    Map.take(user, @fields)
  end
end
