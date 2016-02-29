defmodule Artisan.Stories.Ordering do
  use Artisan.Web, :model
  alias Artisan.Story

  def move(id, state, index) do
    story = Repo.get(Story, id)

    new_position = calculate_pivot(story, state, index)
    vacate_position(story.project_id, new_position, state)

    story
      |> Story.changeset(%{state: state})
      |> Story.change_position(new_position)
      |> Repo.update
  end

  def vacate_position(project_id, position, state) do
    increment_positions(from s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state
      and s.position >= ^position
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
