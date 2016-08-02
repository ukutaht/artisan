defmodule Artisan.Users.ControllerTest do
  use Artisan.ConnCase
  import Artisan.Test.APIHelper

  @valid_user %{
    name: "User name",
    email: "user@example.com",
    password: "password"
  }

  test "signs up an user" do
    res = build_conn()
      |> post("/api/users/signup", %{user: @valid_user})
      |> json_response(200)

    assert res["user"]["name"] == "User name"
    assert res["token"] != nil
  end

  test "creating with invalid params is a 400 BAD REQUEST" do
    res = build_conn()
      |> post("/api/users/signup", %{user: %{name: "", password: "blah"}})

    assert res.status == 400
  end

  test "allows user to update profile" do
    created = create_user()

    updated = authenticated_conn(created["token"])
      |> put("/api/users/current", %{avatar: "avatar.com"})
      |> json_response(200)

    assert updated["avatar"] == "avatar.com"
  end

  test "updating with invalid params is a 400 BAD REQUEST" do
    created = create_user()

    res = authenticated_conn(created["token"])
      |> put("/api/users/current", %{name: ""})

    assert res.status == 400
  end

  test "logs in an user" do
    build_conn()
      |> post("/api/users/signup", %{user: @valid_user})
      |> json_response(200)

    res = build_conn()
      |> post("/api/users/login", %{email: @valid_user[:email], password: @valid_user[:password]})
      |> json_response(200)

    assert res["user"]["name"] == "User name"
    assert res["token"] != nil
  end

  test "401s for user that does not exist" do
    res = build_conn()
      |> post("/api/users/login", %{email: "baa", password: @valid_user[:password]})

    assert res.status == 401
  end

  test "401s for wrong password" do
    build_conn()
      |> post("/api/users/signup", %{user: @valid_user})
      |> json_response(200)

    res = build_conn()
      |> post("/api/users/login", %{email: @valid_user[:email], password: "obviously wrong"})

    assert res.status == 401
  end

  test "finds a user" do
    user = create_user()

    found = authenticated_conn(user["token"])
      |> get("/api/users/current")
      |> json_response(200)

    assert found["name"] == user["user"]["name"]
  end
end
