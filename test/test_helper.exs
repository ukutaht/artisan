if System.get_env("CIRCLE_TEST_REPORTS") do
  ExUnit.configure formatters: [JUnitFormatter]
end

ExUnit.start

Ecto.Adapters.SQL.Sandbox.mode(Artisan.Repo, :manual)
