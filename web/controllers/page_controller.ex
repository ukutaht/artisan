defmodule Artisan.PageController do
  use Artisan.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
