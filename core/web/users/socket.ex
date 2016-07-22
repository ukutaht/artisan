defmodule Artisan.Users.Socket do
  use Phoenix.Socket
  alias Artisan.Users.Token

  channel "boards:*", Artisan.BoardChannel

  transport :websocket, Phoenix.Transports.WebSocket

  def connect(%{"token" => token}, socket) do
    case Token.verify(token) do
      {:ok, user_id} ->
        {:ok, assign(socket, :current_user, user_id)}
      {:error, _} ->
        :error
    end
  end

  def id(_socket), do: nil
end
