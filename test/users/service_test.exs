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
    {:ok, user} = Users.create(@valid_params)

    assert Repo.get(User, user.id).name == "name"
  end

  test "does not create user with invalid params" do
    {:error, _} = Users.create(@invalid_params)

    assert Repo.aggregate(User, :count, :id) == 0
  end

  test "does not allow duplicate emails" do
    {:ok, _} = Users.create(@valid_params)
    {:error, user} = Users.create(@valid_params)

    assert user.errors[:email] != nil
  end

  test "validates that password is at least 6 characters" do
    {:error, user} = Users.create(%{@valid_params | "password" => "12345"})

    assert user.errors[:password] != nil
  end

  test "updates user" do
    {:ok, user} = Users.create(@valid_params)
    {:ok, updated} = Users.update(user.id, %{name: "New Name"})

    assert updated.name == "New Name"
  end

  test "hashes the password" do
    {:ok, user} = Users.create(@valid_params)

    refute user.password_hash == ""
  end

  test "invites another user to artisan as part of a project" do
    {:ok, current_user} = Users.create(@valid_params)
    project = Helpers.create_project
    Artisan.Projects.add_collaborator(project.id, current_user.id)
    Users.invite(current_user.id, "another@email.com", project.id)

    assert_delivered_email(Artisan.Users.Email.Emails.invite_to_project(current_user, "another@email.com", project))
  end

  test "invites another user to artisan without a project" do
    {:ok, current_user} = Users.create(@valid_params)
    Users.invite(current_user.id, "another@email.com", nil)

    assert_delivered_email(Artisan.Users.Email.Emails.invite(current_user, "another@email.com"))
  end

  test "does not send out invite if current user is not a collaborator on project" do
    {:ok, current_user} = Users.create(@valid_params)
    project = Helpers.create_project
    Users.invite(current_user.id, "another@email.com", project.id)

    assert_no_emails_delivered
  end
end
