defmodule Artisan.HealthController do
  use Artisan.Web, :controller

  def health(conn, _params) do
    conn |> json("ok")
  end
end
