defmodule Artisan.Mixfile do
  use Mix.Project

  def project do
    [app: :artisan,
     version: "0.0.1",
     elixir: "~> 1.3",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases,
     deps: deps]
  end

  def application do
    [mod: {Artisan, []},
     applications: [:phoenix, :phoenix_pubsub, :cowboy, :logger, :slugger,
                    :phoenix_ecto, :postgrex, :comeonin]]
  end

  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  defp deps do
    [
      {:phoenix, "~> 1.2"},
      {:phoenix_pubsub, "~> 1.0"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_ecto, "~> 3.0"},
      {:cowboy, "~> 1.0"},
      {:comeonin, "~> 2.1"},
      {:slugger, "~> 0.1.0"},
      {:distillery, "~> 0.8"},
      {:junit_formatter, "~> 1.1.0", only: :test}
   ]
  end

  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"],
     "test": ["ecto.create --quiet", "ecto.migrate", "test"]]
  end
end
