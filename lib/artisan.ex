defmodule Artisan do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    configure()

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

  defp configure do
    add_env(:artisan, Artisan.Mailer, api_key: System.get_env("SENDGRID_API_KEY"))
  end

  defp add_env(application, key, kv) do
    existing = Application.get_env(application, key, [])
    Application.put_env(application, key, Keyword.merge(existing, kv))
  end
end
