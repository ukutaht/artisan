use Mix.Config

config :artisan, Artisan.Endpoint,
  http: [port: 4001],
  server: false

config :logger, level: :warn

config :artisan, Artisan.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "artisan_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :comeonin, :bcrypt_log_rounds, 4
