defmodule Artisan.Stories.View do
  use Phoenix.View, root: ""

  @fields [:id, :acceptance_criteria, :project_id, :completed_in, :name, :state, :number, :estimate, :optimistic, :realistic, :pessimistic, :position, :tags]

  @empty_states %{
    "backlog" => [],
    "ready" => [],
    "working" => [],
    "completed" => []
  }

  def render("by_state.json", %{stories: stories}) do
    Enum.map(stories, fn({k,v}) ->
      {k, render("stories.json", stories: v)}
    end)
    |> Enum.into(@empty_states)
  end

  def render("move.json", %{story: story, originator: originator, from: from, to: to, index: index}) do
    %{
      story: render("story.json", story: story),
      originator: Artisan.Users.View.render("user.json", user: originator),
      from: from,
      to: to,
      index: index
    }
  end

  def render("update.json", %{story: story, originator: originator}) do
    %{
      story: render("story.json", story: story),
      originator: Artisan.Users.View.render("user.json", user: originator)
    }
  end

  def render("deleted.json", %{story: story, originator: originator}) do
    %{
      id: story.id,
      number: story.number,
      from: story.state,
      originator: Artisan.Users.View.render("user.json", user: originator)
    }
  end

  def render("story.json", %{story: story}) do
    Map.take(story, @fields)
      |> associate_creator(story)
      |> associate_assignee(story)
      |> format_created_at(story)
  end

  def render("stories.json", %{stories: stories}) do
    Enum.map(stories, fn(story) -> render("story.json", story: story)end)
  end

  def render("invalid.json", %{story: story}) do
    Artisan.ErrorHelper.serialize_errors(story)
  end

  defp associate_creator(map, %{creator: creator}) do
    creator = Artisan.Users.View.render("user.json", user: creator)
    Map.put(map, :creator, creator)
  end

  defp associate_assignee(map, %{assignee: nil}) do
    Map.put(map, :assignee, nil)
  end

  defp associate_assignee(map, %{assignee: assignee}) do
    assignee = Artisan.Users.View.render("user.json", user: assignee)
    Map.put(map, :assignee, assignee)
  end

  defp format_created_at(map, %{inserted_at: timestamp}) do
    Map.put(map, :created_at, timestamp)
  end
end
