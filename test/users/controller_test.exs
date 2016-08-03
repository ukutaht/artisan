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
      |> post("/api/users/signup", user: @valid_user, token: nil)
      |> json_response(200)

    assert res["user"]["name"] == "User name"
    assert res["token"] != nil
  end

  test "creating with invalid params is a 400 BAD REQUEST" do
    res = build_conn()
      |> post("/api/users/signup", user: %{name: "", password: "blah"}, token: nil)

    assert res.status == 400
  end

  test "return 403 FORBIDDEN when user tries to sign up with invalid token" do
    res = build_conn()
      |> post("/api/users/signup", user: @valid_user, token: "invalid")

    assert res.status == 403
  end

  test "return 403 FORBIDDEN when user tries to sign up with email that doesn't match token" do
    token = Artisan.Users.InviteToken.sign(%{email: "someone@else.com", project_id: 1})

    res = build_conn()
      |> post("/api/users/signup", user: @valid_user, token: token)

    assert res.status == 403
  end

  test "signs up an user and adds to project when invited" do
    inviter = create_user()
    project = create_project(inviter["token"])

    invitee_params = %{@valid_user | email: "someone@else.com"}

    token = Artisan.Users.InviteToken.sign(%{email: invitee_params[:email], project_id: project["id"]})

    res = build_conn()
      |> post("/api/users/signup", user: invitee_params, token: token)

    assert res.status == 200
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
      |> post("/api/users/signup", user: @valid_user, token: nil)
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
      |> post("/api/users/signup", user: @valid_user, token: nil)
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

  test "return 202 ACCEPTED for sucessful invite" do
    user = create_user()

    res = authenticated_conn(user["token"])
      |> post("/api/users/invite", %{email: "new@email.com", project_id: nil})

    assert res.status == 202
  end

  test "return 401 UNAUTHORIZED when inviter does not have a valid token" do
    res = authenticated_conn("invalid")
      |> post("/api/users/invite", %{email: "new@email.com", project_id: nil})

    assert res.status == 401
  end

  test "return 404 NOT FOUND when project to join does not exist" do
    user = create_user()

    res = authenticated_conn(user["token"])
      |> post("/api/users/invite", %{email: "new@email.com", project_id: -1})

    assert res.status == 404
  end

  test "return 400 BAD REQUEST when invitee already exists" do
    user = create_user()

    res = authenticated_conn(user["token"])
      |> post("/api/users/invite", %{email: user["user"]["email"], project_id: nil})

    assert res.status == 400
  end
end
