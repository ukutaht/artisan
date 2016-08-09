defmodule Artisan.Stories.Ordering do
  use Artisan.Repo
  alias Artisan.Story

  def move(id, user_id, state, index) do
    {:ok, updated} = Repo.transaction(fn ->
      story = Repo.get(Story, id)

      new_position = calculate_new_position(story, state, index)
      vacate_position(story, new_position, state)

      story
        |> Story.change_position(state, new_position)
        |> autoassign(user_id)
        |> Repo.update
    end)
    updated
  end

  def vacate_position(story, position, state) do
    vacate_many(story.project_id, position, state, 1, story.completed_in)
  end

  def vacate_many(project_id, position, state, amount, completed_in \\ nil) do
    Repo.transaction(fn ->
      query = from(s in active_stories(project_id, state, completed_in),
        where: s.position >= ^position
      )
      Repo.update_all(query, inc: [position: amount])
    end)
  end

  defp calculate_new_position(story, state, index) do
    position_at(story, state, index) || next_position(story, state)
  end

  defp position_at(%{project_id: project_id, completed_in: completed_in, id: id}, state, index) do
    Repo.one(from s in active_stories(project_id, state, completed_in),
      where: s.id != ^id,
      order_by: s.position,
      offset: ^index,
      select: s.position,
      limit: 1
    )
  end

  defp next_position(%{project_id: project_id, completed_in: completed_in, id: id}, state) do
    max_pos = from(s in active_stories(project_id, state, completed_in), where: s.id != ^id)
      |> Repo.aggregate(:max, :position)

    (max_pos || 0) + 1
  end

  defp active_stories(project_id, state, nil) do
    from(s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state,
      where: is_nil(s.completed_in)
    )
  end

  defp active_stories(project_id, state, completed_in) do
    from(s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state,
      where: s.completed_in == ^completed_in
    )
  end

  defp autoassign(changeset, user_id) do
    if should_autoassign?(changeset) do
      Story.assign(changeset, user_id)
    else
      changeset
    end
  end

  defp should_autoassign?(changeset) do
    is_nil(changeset.data.assignee_id) &&
      changeset.changes[:state] in ["working", "completed"]
  end
end
