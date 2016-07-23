defmodule Artisan.Projects.ChannelTest do
  use Artisan.ModelCase
  use Artisan.ChannelCase
  alias Artisan.Projects.Channel

  setup do
    {:ok, user} = Repo.insert(%Artisan.User{name: "User name", email: "user@email.com", password_hash: "123"})
    socket = socket(nil, %{current_user: user.id})

    {:ok, %{socket: socket, user: user}}
  end

  test "joins successfully when user is a collaborator on the project", %{socket: socket, user: user} do

    {:ok, project} = Repo.insert(%Artisan.Project{name: "Name", slug: "slug"})

    Artisan.Projects.add_collaborator(project.id, user.id)

    name = "projects:#{project.id}"
    assert Channel.join(name, "", socket) == {:ok, socket}
  end

  test "does not join if project does not exist", %{socket: socket} do
    assert Channel.join("projects:1", "", socket) == {:error, %{reason: "Unauthorized"}}
  end
end
