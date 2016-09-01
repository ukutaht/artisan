defmodule Artisan.Iterations.Controller do
  use Phoenix.Controller
  alias Artisan.Iterations

  def current(conn, %{"project_id" => project_id}) do
    case Iterations.current(project_id) do
      nil -> conn |> send_resp(404, "")
      current -> conn |> render("current.json", current)
    end
  end

  def get(conn, %{"project_id" => project_id, "number" => number}) do
    {int_number, ""} = Integer.parse(number)
    conn |> render("current.json", Iterations.get(project_id, int_number))
  end

  def get_by_story(conn, %{"project_id" => project_id, "story_number" => story_number}) do
    case Iterations.get_by_story(project_id, story_number) do
      nil -> send_resp(conn, 404, "")
      iteration -> render(conn, "by_story.json", iteration)
    end
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
