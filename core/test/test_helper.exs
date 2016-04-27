ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Artisan.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Artisan.Repo --quiet)
Ecto.Adapters.SQL.Sandbox.mode(Artisan.Repo, :manual)
