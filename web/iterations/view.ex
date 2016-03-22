defmodule Artisan.Iterations.View do
  use Artisan.Web, :view

  @fields [:id, :project_id, :number, :state]

  def render("iteration.json", %{iteration: iteration}) do
    Map.take(iteration, @fields)
  end

  def render("with_stories.json", %{iteration: iteration, stories: stories}) do
    %{
      iteration: render("iteration.json", iteration: iteration),
      stories: Artisan.Stories.View.render("by_state.json", stories: stories)
    }
  end
end
