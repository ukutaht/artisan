defmodule Artisan.Stories.Ordering do
  use Artisan.Web, :model
  alias Artisan.Story

  def move(id, state, index) do
    story = Repo.get(Story, id)

    new_position = calculate_pivot(story, state, index)
    vacate_position(story.project_id, new_position, state)

    story
      |> Story.change_position(state, new_position)
      |> Repo.update
  end

  def vacate_position(project_id, position, state) do
    vacate_many(project_id, position, state, 1)
  end

  def vacate_many(project_id, position, state, amount) do
    query = from(s in active_stories(project_id, state),
      where: s.position >= ^position
    )
    increment_positions(query, amount)
  end


  defp calculate_pivot(story, state, index) do
    pivot = position_at(story, state, index) || next_position(story.project_id, state)

    if moving_down?(story, state, pivot), do: pivot + 1, else: pivot
  end

  defp position_at(%{project_id: project_id}, state, index) do
    Repo.first(from s in active_stories(project_id, state),
      order_by: s.position,
      offset: ^index,
      select: s.position
    )
  end

  defp next_position(project_id, state) do
    q = from(s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state
    )
    max_pos = Repo.aggregate(q, :max, :position) || 0
    max_pos + 1
  end

  defp moving_down?(story, state, new_position) do
    story.state == state && story.position < new_position
  end

  defp increment_positions(query, amount) do
    Repo.update_all(query, inc: [position: amount])
  end

  defp active_stories(project_id, state) do
    from(s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state,
      where: is_nil(s.completed_in)
    )
  end
end
