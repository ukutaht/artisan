defmodule Artisan.Stories.View do
  use Artisan.Web, :view

  @fields [:id, :acceptance_criteria, :project_id, :completed_in, :name, :state, :number, :estimate, :optimistic, :realistic, :pessimistic, :position, :tags]
  @creator_fields [:id, :name, :email]

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

  def render("story.json", %{story: story}) do
    Map.take(story, @fields)
      |> associate_creator(story)
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

  defp format_created_at(map, %{inserted_at: timestamp}) do
    Map.put(map, :created_at, timestamp)
  end
end
