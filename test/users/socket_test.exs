defmodule Artisan.Users.SocketTest do
  use Artisan.ChannelCase
  alias Artisan.Users.Socket

  @valid_token Artisan.Users.Token.sign(1)
  @invalid_token "obviously wrong"

  setup do
    {:ok, %{socket: socket(nil, %{})}}
  end

  test "errors when users does not pass a valid token", %{socket: socket} do
    assert Socket.connect(%{"token" => @invalid_token}, socket) == :error
  end

  test "authenticates with valid token", %{socket: socket} do
    assert {:ok, _} = Socket.connect(%{"token" => @valid_token}, socket)
  end

  test "assigns current user id", %{socket: socket} do
    {:ok, connected} = Socket.connect(%{"token" => @valid_token}, socket)

    assert connected.assigns[:current_user] == 1
  end
end
