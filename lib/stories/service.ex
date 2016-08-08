defmodule Artisan.Stories do
  use Artisan.Repo
  alias Artisan.Story
  alias Artisan.Stories.Ordering

  def by_state(project_id) do
    Repo.all(from s in Story,
      where: s.project_id == ^project_id,
      where: is_nil(s.completed_in),
      order_by: s.position,
      preload: [:creator, :assignee]
    )
    |> Enum.group_by(&(&1.state))
  end

  def create(creator_id, project_id, attrs) do
    changeset = %Story{number: next_number(project_id), position: 0, project_id: project_id, creator_id: creator_id}
      |> Story.new(attrs)

    if changeset.valid? do
      Ordering.vacate_position(changeset.data, 0, changeset.changes.state)
      Repo.insert(changeset)
        |> preload_creator
        |> preload_assignee
    else
      {:error, changeset}
    end
  end

  def update(id, attrs) do
    Repo.get(Story, id)
      |> Story.edit(attrs)
      |> Repo.update
      |> preload_creator
      |> preload_assignee
  end

  def delete(id) do
    Repo.delete(%Story{id: id})
  end

  def move(id, user_id, state, index) do
    case Ordering.move(id, user_id, state, index) do
      {:ok, updated} ->
        {:ok, updated.project_id, all_stories_for(updated)}
      {:error, error} ->
        {:error, error}
    end
  end

  def mark_completed_in(iteration) do
    active_stories(iteration.project_id, "completed")
      |> Repo.update_all(set: [completed_in: iteration.id])
  end

  def move_working_to_ready(project_id) do
    q = active_stories(project_id, "working")

    max_pos = Repo.aggregate(q, :max, :position) || 0
    Ordering.vacate_many(project_id, 0, "ready", max_pos)
    Repo.update_all(q, set: [state: "ready"])
  end

  def completed_in(iteration_id) do
    Repo.all(from s in Story,
      where: s.completed_in == ^iteration_id,
      order_by: s.position,
      preload: [:creator, :assignee]
    )
    |> Enum.group_by(&(&1.state))
  end

  defp next_number(project_id) do
    q = from(s in Story, where: s.project_id == ^project_id)
    (Repo.aggregate(q, :max, :number) || 0) + 1
  end

  defp active_stories(project_id, state) do
    from(s in Story,
      where: s.project_id == ^project_id,
      where: s.state == ^state,
      where: is_nil(s.completed_in)
    )
  end

  defp all_stories_for(%Story{completed_in: nil, project_id: project_id}), do: by_state(project_id)
  defp all_stories_for(story), do: completed_in(story.completed_in)

  defp preload_creator({:ok, story}), do: {:ok, Repo.preload(story, :creator)}
  defp preload_creator({:error, changeset}), do: {:error, changeset}

  defp preload_assignee({:ok, story}), do: {:ok, Repo.preload(story, :assignee)}
  defp preload_assignee({:error, changeset}), do: {:error, changeset}
end
