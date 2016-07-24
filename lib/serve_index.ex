defmodule Artisan.ServeIndex do
  @behaviour Plug
  import Plug.Conn

  def init(options) do
    options
  end

  def call(conn, _opts) do
    respond(conn.request_path, conn)
  end

  defp respond("/api/" <> _, conn) do
    conn
  end

  defp respond(_, conn) do
    conn
    |> send_file(200, Path.expand("../priv/static/index.html", __DIR__))
    |> halt
  end
end
