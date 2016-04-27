defmodule Artisan.Endpoint do
  use Phoenix.Endpoint, otp_app: :artisan

  socket "/socket", Artisan.UserSocket

  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug CORSPlug
  plug Artisan.Router
end
