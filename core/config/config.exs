use Mix.Config

config :artisan, Artisan.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "ubBZ4vHcx5/VHUELbGFK9asWetpcln82rLpuDGsW9AWfUp6VRr2knrN0dKnEYTfh",
  render_errors: [accepts: ~w(json)],
  pubsub: [name: Artisan.PubSub,
           adapter: Phoenix.PubSub.PG2],
  check_origin: ["artisan-staging-2045808215.eu-west-1.elb.amazonaws", "localhost"]

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

import_config "#{Mix.env}.exs"

config :phoenix, :generators,
  migration: true,
  binary_id: false

config :artisan, ecto_repos: [Artisan.Repo]
