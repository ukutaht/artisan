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

  def invite(current_user_id, email, project_id) do
    if Artisan.Projects.is_collaborator?(project_id, current_user_id) do
      Emails.invite(email, project_id)
        |> Artisan.Mailer.deliver_later
    else
      {:error, "Unauthorized"}
    end
  end
end
