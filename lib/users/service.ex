defmodule Artisan.Users do
  use Artisan.Repo
  alias Artisan.User
  alias Artisan.Users.Password
  alias Artisan.Users.Email.Emails
  alias Artisan.Users.InviteToken
  alias Artisan.Projects

  def create(%{"password" => password} = user, nil) do
    hash = Password.hash(password)

    %User{}
      |> User.changeset(user)
      |> User.set_password(password, hash)
      |> Repo.insert
  end

  def create(user, invite_token) do
    with {:ok, token} <- InviteToken.verify(invite_token),
          :ok <- ensure_emails_match(user, token),
         {:ok, created} <- create(user, nil),
          :ok <- Projects.add_collaborator(token[:project_id], created.id),
         do: {:ok, created}
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

  def invite(current_user, email, nil), do: send_invite(current_user, email, nil)
  def invite(current_user, email, project_id) do
    project = Artisan.Projects.find_by_id(current_user, project_id)

    if project do
      send_invite(current_user, email, project)
    else
      {:error, :not_found}
    end
  end

  defp send_invite(current_user, email, project) do
    inviter = find(current_user)

    existing = Repo.one(from u in User, where: u.email == ^email)

    if !existing do
      Emails.invite(inviter, email, project)
        |> Artisan.Mailer.deliver_later
      :ok
    else
      {:error, :already_signed_up}
    end
  end

  defp ensure_emails_match(%{"email" => email}, %{email: email}), do: :ok
  defp ensure_emails_match(_, _), do: {:error, :invite_email_mismatch}
end
