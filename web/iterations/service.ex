defmodule Artisan.Iterations do
  use Artisan.Web, :model
  alias Artisan.Iteration

  def create_for(project_id) do
    {:ok, iteration} = %Iteration{number: next_number(project_id), state: "planning"}
      |> Iteration.changeset(%{project_id: project_id})
      |> Repo.insert

    {:ok, %{iteration: iteration, stories: stories_for(iteration)}}
  end

  def current(project_id) do
    iteration = Repo.first(from i in Iteration,
      where: i.project_id == ^project_id,
      order_by: [desc: i.number]
    )

    %{
      iteration: iteration,
      stories: stories_for(iteration),
      all_iterations: all_for(project_id)
    }
  end

  def start(iteration_id) do
    Repo.get(Iteration, iteration_id)
      |> Iteration.changeset(%{state: "working"})
      |> Repo.update
  end

  def complete(iteration_id) do
    {:ok, updated} = Repo.get(Iteration, iteration_id)
      |> Iteration.changeset(%{state: "completed"})
      |> Repo.update

    Artisan.Stories.mark_completed_in(updated)
    Artisan.Stories.move_working_to_ready(updated.project_id)

    {:ok, %{iteration: updated, stories: stories_for(updated)}}
  end

  defp stories_for(%Iteration{state: "completed", id: id}) do
    Artisan.Stories.completed_in(id)
  end

  defp stories_for(%Iteration{project_id: project_id}) do
    Artisan.Stories.by_state(project_id)
  end

  defp next_number(project_id) do
    q = from(i in Iteration, where: i.project_id == ^project_id)
    Repo.aggregate(q, :count, :id) + 1
  end

  defp all_for(project_id) do
    Repo.all(from i in Iteration,
      where: i.project_id == ^project_id
    )
  end
end
