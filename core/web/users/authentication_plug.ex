defmodule Artisan.Users.AuthenticationPlug do
  import Plug.Conn
  @two_weeks 1209600

  def init(default), do: default

  def call(conn, _) do
    get_req_header(conn, "authorization") |> authenticate(conn)
  end

  def authenticate([], conn) do
    conn |> send_resp(401, "") |> halt
  end

  def authenticate(["Bearer " <> token], conn) do
    case Phoenix.Token.verify(Artisan.Endpoint, "user", token, max_age: @two_weeks) do
      {:ok, user_id} ->
        assign(conn, :current_user, user_id)
      {:error, _} ->
        conn |> send_resp(401, "") |> halt
    end
  end
end