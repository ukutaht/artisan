defmodule Artisan.Users.Controller do
  use Artisan.Web, :controller
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

  defp invalid(conn, %{errors: errors}) do
    conn |> put_status(400) |> json(%{errors: Enum.into(errors, %{})})
  end
end
