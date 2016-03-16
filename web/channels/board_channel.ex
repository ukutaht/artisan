defmodule Artisan.BoardChannel do
  use Phoenix.Channel

  def join("boards:" <> _project_id, _message, socket) do
    {:ok, socket}
  end
end
