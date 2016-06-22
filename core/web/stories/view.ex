defmodule Artisan.Stories.View do
  use Artisan.Web, :view

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

  def render("story.json", %{story: story}) do
    Map.take(story, @fields)
  end

  def render("stories.json", %{stories: stories}) do
    Enum.map(stories, fn(story) -> render("story.json", story: story)end)
  end

  def render("invalid.json", %{changeset: changeset}) do
    errors = Enum.reduce(changeset.errors, %{}, fn({field, {msg, _meta}}, acc) ->
      errors_on_field = Map.get(acc, field, [])
      Map.put(acc, field, errors_on_field ++ [msg])
    end)

  %{errors: errors}
  end
end
