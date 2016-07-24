use Mix.Config

config :artisan, Artisan.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [node: ["node_modules/brunch/bin/brunch", "watch", "-j",
              cd: Path.expand("../", __DIR__)]]

config :logger, :console, format: "[$level] $message\n"

config :phoenix, :stacktrace_depth, 20

config :artisan, Artisan.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "artisan_dev",
  hostname: "localhost",
  pool_size: 10
