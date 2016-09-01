defmodule Artisan.ErrorView do
  use Phoenix.View, root: "lib"

  def render("500.json", _) do
    ""
  end

  def render("404.json", _) do
    ""
  end
end
