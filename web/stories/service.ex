defmodule Artisan.Stories do
  use Artisan.Web, :model
  alias Artisan.Story
  alias Artisan.Stories.Ordering

  @empty_states %{
    "backlog" => [],
    "ready" => [],
    "working" => [],
    "completed" => []
  }

  def by_state(project_id) do
    Repo.all(from s in Story,
      where: s.project_id == ^project_id,
      where: is_nil(s.completed_in),
      order_by: [desc: s.position]
    )
    |> Enum.group_by(&(&1.state))
    |> into_empty_states
  end

  defp into_empty_states(found) do
    Map.merge(@empty_states, found)
  end

  def create(project_id, attrs) do
    changeset = %Story{number: next_number(project_id), position: 0, project_id: project_id}
      |> Story.new(attrs)

    if changeset.valid? do
      Ordering.vacate_position(project_id, 0, changeset.changes.state)
      Repo.insert(changeset)
    else
      {:error, changeset}
    end
  end

  def update(id, attrs) do
    Repo.get(Story, id)
      |> Story.edit(attrs)
      |> Repo.update
  end

  def move(id, state, index) do
    case Ordering.move(id, state, index) do
      {:ok, updated} ->
        {:ok, updated.project_id, by_state(updated.project_id)}
      {:error, error} ->
        {:error, error}
    end
  end

  def mark_completed_in(iteration) do
    q = from(s in Story,
      where: s.project_id == ^iteration.project_id,
      where: is_nil(s.completed_in),
      where: s.state == "completed"
    )

    Repo.update_all(q, set: [completed_in: iteration.id])
  end

  def move_working_to_ready(project_id) do
    q = from(s in Story,
      where: s.project_id == ^project_id,
      where: s.state == "working"
    )

    max_pos = Repo.aggregate(q, :max, :position) || 0
    Ordering.vacate_many(project_id, 0, "ready", max_pos)
    Repo.update_all(q, set: [state: "ready"])
  end

  def completed_in(iteration_id) do
    Repo.all(from s in Story,
      where: s.completed_in == ^iteration_id,
      order_by: [desc: s.position]
    )
    |> Enum.group_by(&(&1.state))
    |> into_empty_states
  end

  defp next_number(project_id) do
    q = from(s in Story, where: s.project_id == ^project_id)
    Repo.aggregate(q, :count, :id) + 1
  end
end
