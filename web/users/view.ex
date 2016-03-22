defmodule Artisan.Users.View do
  use Artisan.Web, :view

  @fields [:id, :name, :email]

  def render("user.json", %{user: user}) do
    Map.take(user, @fields)
  end
end
