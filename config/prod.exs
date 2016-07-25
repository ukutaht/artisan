use Mix.Config

config :artisan, Artisan.Endpoint,
  url: [host: "staging.artisan-app.com", port: 80],
  server: true,
  http: [port: {:system, "PORT"}]

config :logger, level: :debug

config :artisan, Artisan.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: {:system, "DB_URL"},
  pool_size: 20
