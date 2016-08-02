defmodule Artisan.Users.Controller do
  use Phoenix.Controller
  alias Artisan.Users

  def signup(conn, %{"user" => user}) do
    case Users.create(user) do
      {:ok, created} ->
        token = Phoenix.Token.sign(conn, "user", created.id)
        conn |> render("authenticated.json", user: created, token: token)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    case Users.login(email, password) do
      {:ok, user} ->
        token = Phoenix.Token.sign(conn, "user", user.id)
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
    Users.invite(conn.assigns[:current_user], email, project_id)

    conn |> send_resp(202, "")
  end

  defp invalid(conn, user) do
    conn |> put_status(400) |> render("invalid.json", user: user)
  end
end
