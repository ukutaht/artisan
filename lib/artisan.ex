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
    merge_env(:artisan, Artisan.Mailer,   api_key:         System.get_env("SENDGRID_API_KEY"))
    merge_env(:artisan, Artisan.Endpoint, secret_key_base: System.get_env("SECRET_KEY_BASE"))
  end

  defp merge_env(application, key, overrides) do
    existing = Application.get_env(application, key, [])
    merged = Keyword.merge(existing, overrides, fn(_k, v1, v2) ->
      v2 || v1
    end)

    Application.put_env(application, key, merged)
  end
end
