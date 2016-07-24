defmodule Artisan.Endpoint do
  use Phoenix.Endpoint, otp_app: :artisan

  socket "/socket", Artisan.Users.Socket

  if code_reloading? do
    plug Plug.Static,
      at: "/", from: "app/public", gzip: false,
      only: ~w(css fonts images js favicon.ico robots.txt)

    plug Phoenix.CodeReloader
    plug Artisan.ServeIndex
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Artisan.Router
end