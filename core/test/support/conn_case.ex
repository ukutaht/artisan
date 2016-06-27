defmodule Artisan.ConnCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      use Phoenix.ConnTest

      alias Artisan.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query, only: [from: 1, from: 2]

      import Artisan.Router.Helpers

      @endpoint Artisan.Endpoint
    end
  end

  setup _ do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Artisan.Repo)
  end
end
