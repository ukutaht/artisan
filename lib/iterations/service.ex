defmodule Artisan.Iterations do
  use Artisan.Repo
  alias Artisan.Iteration

  def create_for(project_id) do
    {:ok, iteration} = %Iteration{number: next_number(project_id), state: "planning"}
      |> Iteration.changeset(%{project_id: project_id})
      |> Repo.insert

    {:ok, %{iteration: iteration, stories: stories_for(iteration)}}
  end

  def current(project_id) do
    iterations = all_for(project_id)

    if Enum.empty?(iterations) do
      nil
    else
      current = current_from(iterations)
      %{
        iteration: current,
        stories: stories_for(current),
        all_iterations: iterations
      }
    end
  end

  def get_by_story(project_id, story_number) do
    story = Repo.one(from s in Artisan.Story,
      where: s.project_id == ^project_id,
      where: s.number == ^story_number,
      preload: [:creator, :assignee]
    )

    if story do
      iterations = all_for(project_id)
      iteration = Enum.find(iterations, fn(i) -> i.id == story.completed_in end) || current_from(iterations)

      %{
        iteration: iteration,
        stories: stories_for(iteration),
        all_iterations: iterations,
        story: story
      }
    else
      nil
    end
  end

  def get(project_id, number) do
    iterations = all_for(project_id)
    iteration = Enum.find(iterations, fn(i) -> i.number == number end)

    %{
      iteration: iteration,
      stories: stories_for(iteration),
      all_iterations: iterations
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

  defp current_from(iterations) do
    Enum.max_by(iterations, fn(i) -> i.number end)
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
      where: i.project_id == ^project_id,
      order_by: i.number
    )
  end
end
