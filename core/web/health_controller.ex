defmodule Artisan.HealthController do
  use Artisan.Web, :controller

  def health(conn, _params) do
    conn |> json(%{
      database: db_status()
    })
  end

  defp db_status do
    try do
      Repo.get(Artisan.Project, 1)
      "ok"
    rescue
      e in DBConnection.ConnectionError ->
        e.message
      e ->
      "error"
    end
  end
end
