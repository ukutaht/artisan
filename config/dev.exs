use Mix.Config

config :artisan, Artisan.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false

config :artisan, Artisan.Endpoint,
  live_reload: [
    patterns: [
      ~r{app/public/.*(js|css|png|jpeg|jpg|gif|svg)$},
    ]
  ]

config :logger, :console, format: "[$level] $message\n"

config :phoenix, :stacktrace_depth, 20

config :artisan, Artisan.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "artisan_dev",
  hostname: "localhost",
  pool_size: 10
