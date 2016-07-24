ExUnit.configure formatters: [JUnitFormatter, ExUnit.CLIFormatter]
ExUnit.start

IO.inspect(System.get_env("CIRCLE_TEST_REPORTS"))

Ecto.Adapters.SQL.Sandbox.mode(Artisan.Repo, :manual)
