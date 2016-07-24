defmodule Artisan.ChannelCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      use Phoenix.ChannelTest

      alias Artisan.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query, only: [from: 1, from: 2]


      @endpoint Artisan.Endpoint
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Artisan.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Artisan.Repo, {:shared, self()})
    end

    :ok
  end
end
