defmodule Artisan.Iterations.Controller do
  use Artisan.Web, :controller
  alias Artisan.Iterations

  def current(conn, %{"project_id" => project_id}) do
    conn |> render("with_stories.json", Iterations.current(project_id))
  end

  def complete(conn, %{"iteration_id" => iteration_id}) do
    {:ok, completed} = Iterations.complete(iteration_id)
    conn |> render("with_stories.json", completed)
  end

  def create(conn, %{"project_id" => project_id}) do
    {:ok, created} = Iterations.create_for(project_id)
    conn |> render("with_stories.json", created)
  end

  def start(conn, %{"iteration_id" => iteration_id}) do
    {:ok, started} = Iterations.start(iteration_id)
    conn |> render("iteration.json", iteration: started)
  end
end
