defmodule Artisan.Projects.ChannelTest do
  use Artisan.ChannelCase
  alias Artisan.Projects.Channel
  alias Artisan.Test.Helpers

  setup do
    user = Helpers.create_user()
    project = Helpers.create_project()
    Artisan.Projects.add_collaborator(project.id, user.id)

    {:ok, %{user: user, project: project}}
  end

  test "joins successfully when user is a collaborator on the project", %{project: project, user: user} do
    socket = socket(nil, %{current_user: user.id})
    name = "projects:#{project.id}"
    assert {:ok, _} = Channel.join(name, "", socket)
  end

  test "does not join if project does not exist", %{user: user} do
    socket = socket(nil, %{current_user: user.id})
    assert Channel.join("projects:1", "", socket) == {:error, %{reason: "Unauthorized"}}
  end

  defp join_channel(%{user: user, project: project} = context) do
    token = Artisan.Users.Token.sign(user.id)
    {:ok, socket} = connect(Artisan.Users.Socket, %{"token" => token})
    {:ok, _, socket} = subscribe_and_join(socket, "projects:#{project.id}")
    Map.put(context, :socket, socket)
  end

  describe "Adding a story" do
    setup [:join_channel]

    @valid_story_params %{
      name: "name",
      state: "ready",
      estimate: 2.25,
      optimistic: 1,
      realistic: 1,
      pessimistic: 2,
      tags: ["bug"],
      acceptance_criteria: "Acceptance criteria"
    }

    test "adds a story", %{socket: socket, user: %{id: user_id}} do
      ref = push(socket, "story:add", @valid_story_params)

      assert_reply ref, :ok, %{name: "name", creator: %{id: ^user_id}}
    end

    test "broadcasts a story add", %{socket: socket} do
      push(socket, "story:add", @valid_story_params)

      assert_broadcast "story:add", %{name: "name"}
    end

    test "does not add a story with invalid params", %{socket: socket} do
      ref = push(socket, "story:add", %{name: ""})

      assert_reply ref, :error, %{errors: _}
    end
  end

  describe "Updating a story" do
    setup [:join_channel]

    test "updates a story with valid params", %{socket: socket, project: project, user: %{id: user_id}} do
      story = Helpers.create_story(project.id, user_id)
      ref = push(socket, "story:update", %{id: story.id, story: %{name: "new name"}})

      assert_reply ref, :ok, %{story: %{name: "new name"}, originator: %{id: ^user_id}}
    end

    test "broadcasts a story update", %{socket: socket, project: project, user: %{id: user_id}} do
      story = Helpers.create_story(project.id, user_id)

      push(socket, "story:update", %{id: story.id, story: %{name: "new name"}})

      assert_broadcast "story:update", %{story: _, originator: _}
    end

    test "does not update story with invalid params", %{socket: socket, project: project, user: %{id: user_id}} do
      story = Helpers.create_story(project.id, user_id)
      ref = push(socket, "story:update", %{id: story.id, story: %{name: ""}})

      assert_reply ref, :error, %{errors: _}
    end
  end

  describe "Moving a story" do
    setup [:join_channel]

    test "moves a story", %{socket: socket, project: project, user: %{id: user_id}} do
      story = Helpers.create_story(project.id, user_id)

      ref = push(socket, "story:move", %{id: story.id, state: "working", index: 0})

      assert_reply ref, :ok, %{from: "ready", to: "working", index: 0, originator: %{id: ^user_id}}
    end

    test "broadcasts story move", %{socket: socket, project: project, user: %{id: user_id}} do
      story = Helpers.create_story(project.id, user_id)

      push(socket, "story:move", %{id: story.id, state: "working", index: 0})

      assert_broadcast "story:move", %{from: "ready", to: "working"}
    end
  end

  describe "Deleting a story" do
    setup [:join_channel]

    test "deletes a story", %{socket: socket, project: project, user: %{id: user_id}} do
      %{id: story_id} = Helpers.create_story(project.id, user_id)

      ref = push(socket, "story:delete", %{id: story_id})

      assert_reply ref, :ok, %{id: ^story_id, originator: %{id: ^user_id}}
    end

    test "broadcasts a story delete", %{socket: socket, project: project, user: %{id: user_id}} do
      %{id: story_id} = Helpers.create_story(project.id, user_id)

      push(socket, "story:delete", %{id: story_id})

      assert_broadcast "story:delete", %{id: ^story_id, originator: %{id: ^user_id}}
    end
  end
end
