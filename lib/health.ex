defmodule Artisan.Health do
  import Plug.Conn
  @behaviour Plug

  @current_sha System.cmd("git", ["rev-parse", "HEAD"])
  @formatted_sha String.trim_trailing(elem(@current_sha, 0))

  def init(options) do
    options
  end

  def call(%Plug.Conn{request_path: "/api/health"} = conn, _opts) do
    conn
      |> put_resp_content_type("application/json")
      |> send_resp(200, health())
      |> halt
  end

  def call(conn, _opts), do: conn

  defp health do
    Poison.encode!(%{
      database: db_status(),
      sha: @formatted_sha
    })
  end

  defp db_status do
    try do
      Artisan.Repo.get(Artisan.Project, 1)
      "ok"
    rescue
      e in DBConnection.ConnectionError ->
        e.message
      _ ->
      "error"
    end
  end
end
