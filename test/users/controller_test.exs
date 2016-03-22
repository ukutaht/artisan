defmodule Artisan.Users.ControllerTest do
  use Artisan.ConnCase

  @valid_user %{
    name: "User name",
    email: "user@example.com",
    password: "password"
  }

  test "signs up an user" do
    res = conn()
      |> post("/api/users", %{user: @valid_user})
      |> json_response(200)

    assert res["name"] == "User name"
  end
end
