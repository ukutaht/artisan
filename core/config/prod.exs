use Mix.Config

config :artisan, Artisan.Endpoint,
  url: [host: "example.com", port: 80],
  server: true,
  http: [port: {:system, "PORT"}]

config :logger,
  backends: [{LoggerFileBackend, :file_logger}]

config :logger, :file_logger,
  path: "/var/log/artisan.log",
  level: :info

config :artisan, Artisan.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: {:system, "DB_URL"},
  pool_size: 20
