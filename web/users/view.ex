defmodule Artisan.Users.View do
  use Artisan.Web, :view

  @fields [:id, :name, :email]

  def render("authenticated.json", %{user: user, token: token}) do
    %{
      user: Map.take(user, @fields),
      token: token
    }
  end
end
