defmodule Artisan.Users.ControllerTest do
  use Artisan.ConnCase

  @valid_user %{
    name: "User name",
    email: "user@example.com",
    password: "password"
  }

  test "signs up an user" do
    res = conn()
      |> post("/api/users/signup", %{user: @valid_user})
      |> json_response(200)

    assert res["user"]["name"] == "User name"
    assert res["token"] != nil
  end

  test "logs in an user" do
    conn()
      |> post("/api/users/signup", %{user: @valid_user})
      |> json_response(200)

    res = conn()
      |> post("/api/users/login", %{email: @valid_user[:email], password: @valid_user[:password]})
      |> json_response(200)

    assert res["user"]["name"] == "User name"
    assert res["token"] != nil
  end

  test "401s for user that does not exist" do
    res = conn()
      |> post("/api/users/login", %{email: "baa", password: @valid_user[:password]})

    assert res.status == 401
  end

  test "401s for wrong password" do
    conn()
      |> post("/api/users/signup", %{user: @valid_user})
      |> json_response(200)

    res = conn()
      |> post("/api/users/login", %{email: @valid_user[:email], password: "obviously wrong"})

    assert res.status == 401
  end
end
