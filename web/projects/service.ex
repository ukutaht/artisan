defmodule Artisan.Projects do
  use Artisan.Web, :model
  alias Artisan.Project

  def create(params) do
    %Project{}
      |> Project.changeset(params)
      |> Repo.insert
  end
end

