defmodule Artisan.Users.Controller do
  use Phoenix.Controller
  alias Artisan.Users

  def signup(conn, %{"user" => user, "token" => token}) do
    case Users.create(user, token) do
      {:ok, created} ->
        token = Artisan.Users.Token.sign(created.id)
        conn |> render("authenticated.json", user: created, token: token)
      {:error, :invite_email_mismatch} ->
        conn |> send_resp(403, "Provided email does not match the invite. Please make sure you've entered the same email you were invited with.")
      {:error, :expired} ->
        conn |> send_resp(403, "Your invite has expired. Please request another invite to sign up with it.")
      {:error, :invalid} ->
        conn |> send_resp(403, "Invalid invite token.")
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    case Users.login(email, password) do
      {:ok, user} ->
        token = Artisan.Users.Token.sign(user.id)
        conn |> render("authenticated.json", user: user, token: token)
      :error ->
        conn |> send_resp(401, "")
    end
  end

  def current(conn, _params) do
    case Users.find(conn.assigns[:current_user]) do
      nil -> conn |> send_resp(404, "")
      user -> conn |> render("user.json", user: user)
    end
  end

  def update_profile(conn, params) do
    case Users.update(conn.assigns[:current_user], params) do
      {:ok, updated} ->
        conn |> render("user.json", user: updated)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def invite(conn, %{"email" => email, "project_id" => project_id}) do
    case Users.invite(conn.assigns[:current_user], email, project_id) do
      :ok ->
        conn |> send_resp(202, "")
      {:error, :already_signed_up} ->
        conn |> send_resp(400, "")
      {:error, :not_found} ->
        conn |> send_resp(404, "")
    end
  end

  defp invalid(conn, user) do
    conn |> put_status(400) |> render("invalid.json", user: user)
  end
end
