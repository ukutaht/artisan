defmodule Artisan.Users do
  use Artisan.Web, :model
  alias Artisan.User

  def create(%{"password" => password} = user) do
    %User{}
      |> User.changeset(user)
      |> User.hash_password(password)
      |> Repo.insert
  end
end
