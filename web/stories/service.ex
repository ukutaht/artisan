defmodule Artisan.Stories do
  use Artisan.Web, :model
  alias Artisan.Story

  def create(attrs) do
    increment_positions(from s in Story)

    %Story{number: count() + 1, position: 0}
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
    shift_others(new_position, state)

    story
      |> Story.changeset(%{state: state})
      |> Story.change_position(new_position)
      |> Repo.update
  end

  defp shift_others(pivot, state) do
    increment_positions(from s in Story,
      where: s.state == ^state
      and s.position >= ^pivot
    )
  end

  defp calculate_pivot(story, state, index) do
    pivot = position_at(state, index) || next_position(state)

    if moving_down?(story, state, pivot), do: pivot + 1, else: pivot
  end

  defp position_at(state, index) do
    Repo.first(from s in Story,
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
