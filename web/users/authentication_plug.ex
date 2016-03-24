defmodule Artisan.Users.AuthenticationPlug do
  import Plug.Conn

  def init(default), do: default

  def call(conn, _) do
    get_req_header(conn, "bearer") |> authenticate(conn)
  end

  def authenticate([], conn) do
    conn |> send_resp(401, "")
  end

  def authenticate([token], conn) do
    case Phoenix.Token.verify(Artisan.Endpoint, "user", token) do
      {:ok, user_id} ->
        assign(conn, :current_user, user_id)
      {:error, _} ->
        conn |> send_resp(401, "")
    end
  end
end
