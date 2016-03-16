defmodule Artisan.Iterations do
  use Artisan.Web, :model
  alias Artisan.Iteration

  def create_for(project_id) do
    %Iteration{number: next_number(project_id), state: "planning"}
      |> Iteration.changeset(%{project_id: project_id})
      |> Repo.insert
  end

  def current(project_id) do
    iteration = Repo.first(from i in Iteration,
      where: i.project_id == ^project_id,
      order_by: [desc: i.number]
    )

    stories = Artisan.Stories.by_state(project_id)

    %{iteration: iteration, stories: stories}
  end

  def start(iteration_id) do
    Repo.get(Iteration, iteration_id)
      |> Iteration.changeset(%{state: "working"})
      |> Repo.update
  end

  def complete(iteration_id) do
    Repo.get(Iteration, iteration_id)
      |> Iteration.changeset(%{state: "completed"})
      |> Repo.update
  end

  defp next_number(project_id) do
    q = from(i in Iteration, where: i.project_id == ^project_id)
    Repo.aggregate(q, :count, :id) + 1
  end
end
