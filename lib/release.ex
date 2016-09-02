defmodule Release.Tasks do
  def migrate do
    {:ok, _} = Application.ensure_all_started(:artisan)

    path = Application.app_dir(:artisan, "priv/repo/migrations")

    Ecto.Migrator.run(Artisan.Repo, path, :up, all: true)

    :init.stop()
  end
end
