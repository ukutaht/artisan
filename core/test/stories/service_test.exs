defmodule Artisan.StoriesTest do
  use Artisan.ModelCase
  alias Artisan.Stories
  alias Artisan.Story

  @valid_story_params %{
    name: "name",
    state: "ready",
    estimate: 2.25,
    optimistic: 1,
    realistic: 1,
    pessimistic: 2,
    tags: ["bug"],
  }

  @invalid_story_params %{
    name: nil
  }

  setup do
    {:ok, project} = Repo.insert(%Artisan.Project{name: "project"})
    {:ok, user} = Artisan.Users.create(%{"name" => "User", "email" => "user@email.com", "password" => "asdasd"})
    {:ok, %{project: project, user: user}}
  end

  def create_in_state(user_id, project_id, state) do
    {:ok, created} = Stories.create(user_id, project_id, %{@valid_story_params | state: state})
    created
  end

  def find_in_state(project_id, state) do
    Stories.by_state(project_id)[state]
  end

  test "creates a story with valid params", %{project: project, user: user} do
    params = Map.put(@valid_story_params, :assignee_id, user.id)
    {:ok, story} = Stories.create(user.id, project.id, params)

    assert Repo.aggregate(Story, :count, :id) == 1

    assert story.name == "name"
    assert story.state == "ready"
    assert story.estimate == 2.25
    assert story.optimistic == 1
    assert story.realistic == 1
    assert story.pessimistic == 2
    assert story.tags == ["bug"]
    assert story.creator.id == user.id
    assert story.assignee.id == user.id
  end

  test "story is created in the first position, order maintained", %{project: project, user: user} do
    {:ok, old} = Stories.create(user.id, project.id, @valid_story_params)
    {:ok, new} = Stories.create(user.id, project.id, @valid_story_params)

    [found1, found2] = find_in_state(project.id, @valid_story_params[:state])

    assert found1.id == new.id
    assert found2.id == old.id
  end

  test "number is generated per-project", %{project: project, user: user} do
    {:ok, project2} = Repo.insert(%Artisan.Project{name: "project"})

    {:ok, story1} = Stories.create(user.id, project.id, @valid_story_params)
    {:ok, story2} = Stories.create(user.id, project2.id, @valid_story_params)
    {:ok, story3} = Stories.create(user.id, project.id, @valid_story_params)

    assert story1.number == 1
    assert story2.number == 1
    assert story3.number == 2
  end

  test "ensures that number grows when stories are deleted", %{project: project, user: user} do
    {:ok, story1} = Stories.create(user.id, project.id, @valid_story_params)
    {:ok, story2} = Stories.create(user.id, project.id, @valid_story_params)

    {:ok, _} = Stories.delete(story1.id)

    {:ok, story3} = Stories.create(user.id, project.id, @valid_story_params)

    assert story2.number == 2
    assert story3.number == 3
  end

  test "does not create a story with invalid params", %{user: user, project: project} do
    {:error, _} = Stories.create(user.id, project.id, @invalid_story_params)

    assert Repo.aggregate(Story, :count, :id) == 0
  end

  test "updates a story with valid params", %{project: project, user: user} do
    {:ok, created} = Stories.create(user.id, project.id, @valid_story_params)
    {:ok, updated} = Stories.update(created.id, %{name: "new name"})

    assert Repo.get(Story, updated.id).name == "new name"
  end

  test "does not update a story with invalid params", %{user: user, project: project} do
    {:ok, created} = Stories.create(user.id, project.id, @valid_story_params)

    assert match?({:error, _}, Stories.update(created.id, %{name: nil}))
  end

  test "does not update stories position or state", %{user: user, project: project} do
    {:ok, created} = Stories.create(user.id, project.id, @valid_story_params)
    {:ok, updated} = Stories.update(created.id, %{state: "new state", position: 999})

    found = Repo.get(Story, updated.id)

    assert found.state != "new state"
    assert found.position != 999
  end

  test "finds all by state", %{user: user, project: project} do
    ready = create_in_state(user.id, project.id, "ready")
    working = create_in_state(user.id, project.id, "working")

    %{"ready" => [found_in_ready], "working" => [found_in_working]} = Stories.by_state(project.id)

    assert found_in_ready.id == ready.id
    assert found_in_working.id == working.id
  end

  test "does not find stories that are not part of the project", %{user: user, project: project} do

    {:ok, project2} = Repo.insert(%Artisan.Project{name: "project"})
    create_in_state(user.id, project2.id, "ready")

    found = Stories.by_state(project.id)

    assert Enum.all?(found, fn({_col, stories}) -> Enum.empty?(stories) end)
  end

  test "does not find stories that were completed in a previous iteration", %{user: user, project: project} do
    {:ok, %{iteration: iteration}} = Artisan.Iterations.create_for(project.id)
    create_in_state(user.id, project.id, "completed")
    Stories.mark_completed_in(iteration)

    found = Stories.by_state(project.id)

    assert Enum.all?(found, fn({_col, stories}) -> Enum.empty?(stories) end)
  end

  test "marks stories as completed in", %{project: project, user: user} do
    {:ok, %{iteration: iteration}} = Artisan.Iterations.create_for(project.id)
    working = create_in_state(user.id, project.id, "working")
    completed = create_in_state(user.id, project.id, "completed")

    Stories.mark_completed_in(iteration)

    assert Repo.get(Story, completed.id).completed_in == iteration.id
    assert Repo.get(Story, working.id).completed_in == nil
  end

  test "stories are not marked twice", %{project: project, user: user} do
    {:ok, %{iteration: iteration1}} = Artisan.Iterations.create_for(project.id)
    completed = create_in_state(user.id, project.id, "completed")

    Stories.mark_completed_in(iteration1)

    {:ok, %{iteration: iteration2}} = Artisan.Iterations.create_for(project.id)
    Stories.mark_completed_in(iteration2)

    assert Repo.get(Story, completed.id).completed_in == iteration1.id
  end

  test "stories are only marked within the project", %{user: user, project: project} do
    {:ok, project2} = Repo.insert(%Artisan.Project{name: "project"})
    {:ok, %{iteration: iteration}} = Artisan.Iterations.create_for(project.id)
    completed_in_project2 = create_in_state(user.id, project2.id, "completed")

    Stories.mark_completed_in(iteration)

    assert Repo.get(Story, completed_in_project2.id).completed_in == nil
  end

  test "gets stories completed in an iteration", %{user: user, project: project} do
    {:ok, %{iteration: iteration}} = Artisan.Iterations.create_for(project.id)
    completed = create_in_state(user.id, project.id, "completed")
    create_in_state(user.id, project.id, "working")

    Stories.mark_completed_in(iteration)
    %{"completed" => [found]} = Stories.completed_in(iteration.id)

    assert found.id == completed.id
  end

  test "moves working stories back to ready", %{user: user, project: project} do
    create_in_state(user.id, project.id, "completed")
    create_in_state(user.id, project.id, "working")
    create_in_state(user.id, project.id, "backlog")

    Stories.move_working_to_ready(project.id)
    found = Stories.by_state(project.id)

    assert found["working"] == nil
    assert found["ready"] |> Enum.count == 1
    assert found["backlog"] |> Enum.count == 1
    assert found["completed"] |> Enum.count == 1
  end

  test "ensures that there are no position clashes when moving from working to ready", %{user: user, project: project} do
    working1 = Repo.insert!(%Story{position: 1, state: "working", name: "name", number: 1, project_id: project.id, creator_id: user.id})
    working2 = Repo.insert!(%Story{position: 100, state: "working", name: "name", number: 2, project_id: project.id, creator_id: user.id})
    ready = Repo.insert!(%Story{position: 1, state: "ready", name: "name", number: 3, project_id: project.id, creator_id: user.id})

    Stories.move_working_to_ready(project.id)
    %{"ready" => [found1, found2, found3]} = Stories.by_state(project.id)

    assert found1.id == working1.id
    assert found2.id == working2.id
    assert found3.id == ready.id
  end

  test "deletes a story", %{user: user, project: project} do
    {:ok, story} = Stories.create(user.id, project.id, @valid_story_params)

    Stories.delete(story.id)

    assert Repo.aggregate(Story, :count, :id) == 0
  end
end
