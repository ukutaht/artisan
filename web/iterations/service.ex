defmodule Artisan.Iterations do
  use Artisan.Web, :model
  alias Artisan.Iteration

  def create_for(project_id) do
    %Iteration{project_id: project_id, number: next_number(project_id)}
      |> Repo.insert
  end

  defp next_number(project_id) do
    q = from(i in Iteration, where: i.project_id == ^project_id)
    Repo.aggregate(q, :count, :id) + 1
  end
end
