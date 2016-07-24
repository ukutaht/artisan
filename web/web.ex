defmodule Artisan.Web do
  def model do
    quote do
      alias Artisan.Repo
      import Ecto
      import Ecto.Query, only: [from: 1, from: 2]
    end
  end

  def controller do
    quote do
      use Phoenix.Controller
      alias Artisan.Repo
    end
  end

  def view do
    quote do
      use Phoenix.View, root: "web/templates"
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
      alias Artisan.Repo
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
