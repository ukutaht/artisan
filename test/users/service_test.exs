defmodule Artisan.UsersTest do
  use Artisan.ModelCase
  alias Artisan.Users
  alias Artisan.User
  use Bamboo.Test

  @valid_params %{
    "name" => "name",
    "email" => "email",
    "password" => "password"
  }

  @invalid_params %{
    "name" => nil,
    "password" => ""
  }

  test "creates the user with valid params" do
    {:ok, user} = Users.create(@valid_params, nil)

    assert Repo.get(User, user.id).name == "name"
  end

  test "does not create user with invalid params" do
    {:error, _} = Users.create(@invalid_params, nil)

    assert Repo.aggregate(User, :count, :id) == 0
  end

  test "when user passes valid token to join project, they're added to project" do
    project = Helpers.create_project
    token = Users.InviteToken.sign(%{email: @valid_params["email"], project_id: project.id})
    {:ok, created} = Users.create(@valid_params, token)

    assert Artisan.Projects.is_collaborator?(project.id, created.id)
  end

  test "does not create user when token is invalid" do
    res = Users.create(@valid_params, "invalid token")

    assert Repo.aggregate(User, :count, :id) == 0
    assert res == {:error, :invalid}
  end

  test "does not create user when token passed but user data is invalid" do
    project = Helpers.create_project
    token = Users.InviteToken.sign(%{email: @valid_params["email"], project_id: project.id})
    res = Users.create(@invalid_params, token)

    assert Repo.aggregate(User, :count, :id) == 0
    assert {:error, _} = res
  end

  test "does not create user when token email does not match passed email" do
    project = Helpers.create_project
    token = Users.InviteToken.sign(%{email: "some@otheremail.com", project_id: project.id})
    res = Users.create(@valid_params, token)

    assert Repo.aggregate(User, :count, :id) == 0
    assert res == {:error, :invite_email_mismatch}
  end

  test "does not allow duplicate emails" do
    {:ok, _} = Users.create(@valid_params, nil)
    {:error, user} = Users.create(@valid_params, nil)

    assert user.errors[:email] != nil
  end

  test "validates that password is at least 6 characters" do
    {:error, user} = Users.create(%{@valid_params | "password" => "12345"}, nil)

    assert user.errors[:password] != nil
  end

  test "hashes the password" do
    {:ok, user} = Users.create(@valid_params, nil)

    refute user.password_hash == ""
  end

  test "updates user" do
    user = Helpers.create_user()
    {:ok, updated} = Users.update(user.id, %{name: "New Name"})

    assert updated.name == "New Name"
  end

  test "invites another user to artisan as part of a project" do
    current_user = Helpers.create_user()
    project = Helpers.create_project()
    Artisan.Projects.add_collaborator(project.id, current_user.id)
    res = Users.invite(current_user.id, "another@email.com", project.id)

    assert res == :ok
  end

  test "does not send out invite if current user is not a collaborator on project" do
    current_user = Helpers.create_user()
    project = Helpers.create_project()
    {:error, :not_found} = Users.invite(current_user.id, "another@email.com", project.id)

    assert_no_emails_delivered
  end

  test "erros when trying to invite existing user to project" do
    current_user = Helpers.create_user()
    project = Helpers.create_project()
    Artisan.Projects.add_collaborator(project.id, current_user.id)
    res = Users.invite(current_user.id, current_user.email, project.id)

    assert res == {:error, :already_signed_up}
  end

  test "invites another user to artisan without a project" do
    current_user = Helpers.create_user()
    res = Users.invite(current_user.id, "another@email.com", nil)

    assert res == :ok
  end

  test "erros when trying to invite existing user without a project" do
    current_user = Helpers.create_user()
    res = Users.invite(current_user.id, current_user.email, nil)

    assert res == {:error, :already_signed_up}
  end
end
