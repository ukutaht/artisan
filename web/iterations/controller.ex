defmodule Artisan.Iterations.Controller do
  use Artisan.Web, :controller
  alias Artisan.Iterations

  def current(conn, %{"project_id" => project_id}) do
    conn |> json(Iterations.current(project_id))
  end

  def complete(conn, %{"iteration_id" => iteration_id}) do
    {:ok, completed} = Iterations.complete(iteration_id)
    conn |> json(completed)
  end

  def create(conn, %{"project_id" => project_id}) do
    {:ok, created} = Iterations.create_for(project_id)
    conn |> json(created)
  end

  def start(conn, %{"iteration_id" => iteration_id}) do
    {:ok, started} = Iterations.start(iteration_id)
    conn |> json(started)
  end
end
