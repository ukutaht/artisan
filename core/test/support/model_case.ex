defmodule Artisan.ModelCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      alias Artisan.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query, only: [from: 1, from: 2]
      import Artisan.ModelCase
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
