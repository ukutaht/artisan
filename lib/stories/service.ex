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

  def current_for(user_id) do
    Repo.all(from s in Story,
      where: s.assignee_id == ^user_id,
      where: is_nil(s.completed_in),
      preload: [:creator, :assignee]
    )
  end

  def update(id, user_id, attrs) do
    Repo.get(Story, id)
      |> Story.edit(attrs)
      |> Repo.update
      |> preload_creator
      |> preload_assignee
      |> add_originator(user_id)
  end

  def delete(user_id, id) do
    Repo.get(Story, id)
      |> Repo.delete
      |> add_originator(user_id)
  end

  def move(id, user_id, state, index) do
    Repo.transaction!(fn() ->
      Ordering.move(id, user_id, state, index)
        |> preload_creator
        |> preload_assignee
        |> add_originator(user_id)
    end)
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

  defp add_originator({:ok, story, from, to}, user_id) do
    {:ok, story, Artisan.Users.find(user_id), from, to}
  end
  defp add_originator({:ok, story}, user_id), do: {:ok, story, Artisan.Users.find(user_id)}
  defp add_originator({:error, changeset}, _), do: {:error, changeset}

  defp preload_creator({:ok, story}), do: {:ok, Repo.preload(story, :creator)}
  defp preload_creator({:ok, story, from, to}), do: {:ok, Repo.preload(story, :creator), from, to}
  defp preload_creator({:error, changeset}), do: {:error, changeset}

  defp preload_assignee({:ok, story}), do: {:ok, Repo.preload(story, :assignee)}
  defp preload_assignee({:ok, story, from, to}), do: {:ok, Repo.preload(story, :assignee), from, to}
  defp preload_assignee({:error, changeset}), do: {:error, changeset}
end
