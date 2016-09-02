defmodule Artisan.Projects.Channel do
  use Phoenix.Channel
  alias Artisan.{Projects, Stories}
  require Logger

  def subscribe(project_id) do
    Artisan.Endpoint.subscribe("projects:#{project_id}")
  end

  def broadcast(project_id, event, payload) do
    Artisan.Endpoint.broadcast!("projects:#{project_id}", event, payload)
  end

  def join("projects:" <> project_id, _message, socket) do
    {project_id, ""} = Integer.parse(project_id)
    user_id = socket.assigns[:current_user]

    if Projects.is_collaborator?(project_id, user_id) do
      {:ok, assign(socket, :project_id, project_id)}
    else
      {:error, %{reason: "Unauthorized"}}
    end
  end

  def handle_in(event, params, socket) do
    Logger.info(["Receive ", event])
    start = System.monotonic_time()

    response = handle_event(event, params, socket)

    stop = System.monotonic_time()
    diff = System.convert_time_unit(stop - start, :native, :micro_seconds)
    Logger.info(["Reply ", event, " in ", formatted_diff(diff)])
    response
  end

  defp handle_event("story:add", params, socket) do
    case Stories.create(socket.assigns[:current_user], socket.assigns[:project_id], params) do
      {:ok, created} ->
        view = render("story.json", story: created)
        broadcast_from!(socket, "story:add", view)
        {:reply, {:ok, view}, socket}
      {:error, changeset} ->
        {:reply, {:error, invalid(changeset)}, socket}
    end
  end

  defp handle_event("story:update", %{"id" => id, "story" => story_params}, socket) do
    case Stories.update(id, socket.assigns[:current_user], story_params) do
      {:ok, updated, originator} ->
        view = render("update.json", story: updated, originator: originator)
        broadcast_from!(socket, "story:update", view)
        {:reply, {:ok, view}, socket}
      {:error, changeset} ->
        {:reply, {:error, invalid(changeset)}, socket}
    end
  end

  defp handle_event("story:move", %{"id" => id, "state" => state, "index" => index}, socket) do
    user_id = socket.assigns[:current_user]
    {:ok, updated, originator, from, to} = Stories.move(id, user_id, state, index)
    view = render("move.json", story: updated, originator: originator, from: from, to: to, index: index)
    broadcast_from!(socket, "story:move", view)
    {:reply, {:ok, view}, socket}
  end

  defp handle_event("story:delete", %{"id" => id}, socket) do
    {:ok, deleted, originator} = Stories.delete(socket.assigns[:current_user], id)
    view = render("deleted.json", story: deleted, originator: originator)

    broadcast_from(socket, "story:delete", view)
    {:reply, {:ok, view}, socket}
  end

  defp invalid(story) do
    render("invalid.json", story: story)
  end

  defp render(name, assigns) do
    Phoenix.View.render(Stories.View, name, assigns)
  end

  defp formatted_diff(diff) when diff > 1000, do: [diff |> div(1000) |> Integer.to_string, "ms"]
  defp formatted_diff(diff), do: [diff |> Integer.to_string, "µs"]
end
