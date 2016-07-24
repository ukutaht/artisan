defmodule Artisan.Iterations.View do
  use Phoenix.View, root: ""

  @fields [:id, :project_id, :number, :state]

  def render("iteration.json", %{iteration: iteration}) do
    Map.take(iteration, @fields)
  end

  def render("iterations.json", %{iterations: iterations}) do
    Enum.map(iterations, fn(iteration) ->
      render("iteration.json", iteration: iteration)
    end)
  end

  def render("current.json", %{iteration: iteration, stories: stories, all_iterations: all_iterations}) do
    %{
      iteration: render("iteration.json", iteration: iteration),
      all_iterations: render("iterations.json", iterations: all_iterations),
      stories: Artisan.Stories.View.render("by_state.json", stories: stories)
    }
  end

  def render("with_stories.json", %{iteration: iteration, stories: stories}) do
    %{
      iteration: render("iteration.json", iteration: iteration),
      stories: Artisan.Stories.View.render("by_state.json", stories: stories)
    }
  end
end
