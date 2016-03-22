defmodule Artisan.Users.Controller do
  use Artisan.Web, :controller
  alias Artisan.Users

  def signup(conn, %{"user" => user}) do
    case Users.create(user) do
      {:ok, created} ->
        conn |> render("user.json", user: created)
      {:error, changeset} ->
        conn |> invalid(changeset)
    end
  end

  defp invalid(conn, %{errors: errors}) do
    conn |> put_status(400) |> json(%{errors: Enum.into(errors, %{})})
  end
end
