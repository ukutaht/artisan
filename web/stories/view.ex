defmodule Artisan.StoryView do
  def render("all.json", %{stories: stories}) do
    stories
  end

  def render("one.json", %{story: story}) do
    story
  end

  def render("errors.json", %{errors: errors}) do
    %{errors: Enum.into(errors.errors, %{})}
  end
end
