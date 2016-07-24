defmodule Artisan.Projects.Channel do
  use Phoenix.Channel
  alias Artisan.Projects

  def subscribe(project_id) do
    Artisan.Endpoint.subscribe("projects:#{project_id}")
  end

  def broadcast(project_id, event, payload) do
    Artisan.Endpoint.broadcast!("projects:#{project_id}", event, payload)
  end

  def join("projects:" <> project_id, _message, socket) do
    user_id = socket.assigns[:current_user]
    if Projects.is_collaborator?(project_id, user_id) do
      {:ok, socket}
    else
      {:error, %{reason: "Unauthorized"}}
    end
  end
end
