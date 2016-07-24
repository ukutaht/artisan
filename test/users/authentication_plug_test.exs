defmodule Artisan.Users.AuthenticationPlugTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @valid_token Artisan.Users.Token.sign(1)
  @invalid_token "obviously wrong"

  test "verifies that user has a signed token in bearer header" do
    conn = conn(:get, "/")
      |> put_req_header("authorization", "Bearer #{@valid_token}")
      |> Artisan.Users.AuthenticationPlug.call(nil)

    assert conn.assigns[:current_user] == 1
  end

  test "sends 401 when header is not present" do
    conn = conn(:get, "/")
      |> Artisan.Users.AuthenticationPlug.call(nil)

    {status, _, _} = sent_resp(conn)

    assert status == 401
  end

  test "sends 401 when token was not signed by us" do
    conn = conn(:get, "/")
      |> put_req_header("authorization", "Bearer #{@invalid_token}")
      |> Artisan.Users.AuthenticationPlug.call(nil)

    {status, _, _} = sent_resp(conn)

    assert status == 401
  end
end
