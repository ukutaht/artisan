defmodule Artisan.Users do
  use Artisan.Repo
  alias Artisan.User
  alias Artisan.Users.Password
  alias Artisan.Users.Email.Emails

  def create(%{"password" => password} = user) do
    hash = Password.hash(password)

    %User{}
      |> User.changeset(user)
      |> User.set_password(password, hash)
      |> Repo.insert
  end

  def update(id, attrs) do
    Repo.get(User, id)
      |> User.edit(attrs)
      |> Repo.update
  end

  def login(email, password) do
    user = Repo.one(from u in User,
      where: u.email == ^email
    )

    if user && Password.match?(password, user.password_hash) do
      {:ok, user}
    else
      :error
    end
  end

  def find(id) do
    Repo.one(from u in User, where: u.id == ^id)
  end

  def invite(current_user, email, nil) do
    inviter = find(current_user)

    Emails.invite(inviter, email)
      |> Artisan.Mailer.deliver_later
    :ok
  end

  def invite(current_user, email, project_id) do
    project = Artisan.Projects.find_by_id(current_user, project_id)

    if project do
      inviter = find(current_user)
      Emails.invite_to_project(inviter, email, project)
        |> Artisan.Mailer.deliver_later
      :ok
    else
      {:error, "Not found"}
    end
  end
end
