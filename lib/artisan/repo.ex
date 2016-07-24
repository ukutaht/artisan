defmodule Artisan.Repo do
  use Ecto.Repo, otp_app: :artisan

  defmacro __using__(_) do
    quote do
      alias Artisan.Repo
      import Ecto
      import Ecto.Query, only: [from: 1, from: 2]
    end
  end
end
