defmodule Artisan.HealthController do
  use Artisan.Web, :controller
  @current_sha System.cmd("git", ["rev-parse", "HEAD"])
  @formatted_sha String.trim_trailing(elem(@current_sha, 0))

  def health(conn, _params) do
    conn |> json(%{
      database: db_status(),
      sha: @formatted_sha
    })
  end

  defp db_status do
    try do
      Repo.get(Artisan.Project, 1)
      "ok"
    rescue
      e in DBConnection.ConnectionError ->
        e.message
      _ ->
      "error"
    end
  end
end
