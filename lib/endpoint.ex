defmodule Artisan.Endpoint do
  use Phoenix.Endpoint, otp_app: :artisan

  socket "/socket", Artisan.Users.Socket

  if code_reloading? do
    plug Plug.Static,
      at: "/", from: "priv/static", gzip: false,
      only: ~w(css fonts images js favicon.ico robots.txt)

    plug Phoenix.CodeReloader
    plug Artisan.ServeIndex
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Artisan.Health

  plug Plug.Parsers,
    parsers: [:json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Artisan.Router
end
