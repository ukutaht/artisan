defmodule Artisan.Stories do
  use Artisan.Web, :model
  alias Artisan.Story

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
    increment_positions(from s in Story, where: s.project_id == ^project_id)

    %Story{number: next_number(project_id), position: 0, project_id: project_id}
      |> Story.changeset(attrs)
      |> Repo.insert
  end

  def update(id, attrs) do
    Repo.get(Story, id)
      |> Story.changeset(attrs)
      |> Repo.update
  end

  def count do
    Repo.aggregate(Story, :count, :id)
  end

  def move(id, state, index) do
    story = Repo.get(Story, id)

    new_position = calculate_pivot(story, state, index)
    shift_others(story, new_position, state)

    result = story
      |> Story.changeset(%{state: state})
      |> Story.change_position(new_position)
      |> Repo.update

    case result do
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

  defp shift_others(%{project_id: project_id}, pivot, state) do
    increment_positions(from s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state
      and s.position >= ^pivot
    )
  end

  defp calculate_pivot(story, state, index) do
    pivot = position_at(story, state, index) || next_position(state)

    if moving_down?(story, state, pivot), do: pivot + 1, else: pivot
  end

  defp position_at(%{project_id: project_id}, state, index) do
    Repo.first(from s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state,
      order_by: s.position,
      offset: ^index,
      select: s.position
    )
  end

  defp next_position(state) do
    q = from(s in Story, where: s.state == ^state)
    max_pos = Repo.aggregate(q, :max, :position) || 0
    max_pos + 1
  end

  defp moving_down?(story, state, new_position) do
    story.state == state && story.position < new_position
  end

  defp increment_positions(query) do
    Repo.update_all(query, inc: [position: 1])
  end
end
