defmodule Artisan do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      supervisor(Artisan.Endpoint, []),
      supervisor(Artisan.Repo, []),
    ]

    opts = [strategy: :one_for_one, name: Artisan.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    Artisan.Endpoint.config_change(changed, removed)
    :ok
  end
end
