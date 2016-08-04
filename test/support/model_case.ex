defmodule Artisan.ModelCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      alias Artisan.Repo
      alias Artisan.Test.Helpers

      import Ecto
      import Ecto.Changeset
      import Ecto.Query, only: [from: 1, from: 2]
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
