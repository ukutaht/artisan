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
      |> Story.changeset(attrs)

    if changeset.valid? do
      Ordering.vacate_position(project_id, 0, changeset.changes.state)
      Repo.insert(changeset)
    else
      {:error, changeset}
    end
  end

  def update(id, attrs) do
    Repo.get(Story, id)
      |> Story.changeset(attrs)
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

  defp next_number(project_id) do
    q = from(s in Story, where: s.project_id == ^project_id)
    Repo.aggregate(q, :count, :id) + 1
  end
end
