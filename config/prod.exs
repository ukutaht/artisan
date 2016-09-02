use Mix.Config

config :artisan, Artisan.Endpoint,
  url: [host: "staging.artisan-app.com", port: 80],
  server: false,
  http: [port: {:system, "PORT"}]

config :logger, level: :info

config :artisan, Artisan.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: {:system, "DB_URL"},
  pool_size: 20

config :artisan, Artisan.Mailer,
  adapter: Bamboo.SendgridAdapter
