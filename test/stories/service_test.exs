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
    tags: ["bug"]
  }

  @invalid_story_params %{
    name: nil
  }

  setup do
    {:ok, project} = Artisan.Projects.create(%{name: "project"})
    {:ok, %{project: project}}
  end

  def create_in_state(project_id, state) do
    {:ok, created} = Stories.create(project_id, %{@valid_story_params | state: state})
    created
  end

  def find_in_state(project_id, state) do
    Stories.by_state(project_id)[state]
  end

  test "creates a story with valid params", %{project: project} do
    {:ok, _} = Stories.create(project.id, @valid_story_params)

    assert Repo.aggregate(Story, :count, :id) == 1
  end

  test "story is created in the first position, order maintained", %{project: project} do
    {:ok, old} = Stories.create(project.id, @valid_story_params)
    {:ok, new} = Stories.create(project.id, @valid_story_params)

    [found1, found2] = find_in_state(project.id, @valid_story_params[:state])

    assert found1.id == new.id
    assert found2.id == old.id
  end

  test "number is generated per-project", %{project: project} do
    {:ok, project2} = Artisan.Projects.create(%{name: "name"})

    {:ok, story1} = Stories.create(project.id, @valid_story_params)
    {:ok, story2} = Stories.create(project2.id, @valid_story_params)
    {:ok, story3} = Stories.create(project.id, @valid_story_params)

    assert story1.number == 1
    assert story2.number == 1
    assert story3.number == 2
  end

  test "does not create a story with invalid params", %{project: project} do
    {:error, _} = Stories.create(project.id, @invalid_story_params)

    assert Repo.aggregate(Story, :count, :id) == 0
  end

  test "updates a story with valid params", %{project: project} do
    {:ok, created} = Stories.create(project.id, @valid_story_params)
    {:ok, updated} = Stories.update(created.id, %{name: "new name"})

    assert Repo.get(Story, updated.id).name == "new name"
  end

  test "does not update a story with invalid params", %{project: project} do
    {:ok, created} = Stories.create(project.id, @valid_story_params)

    assert match?({:error, _}, Stories.update(created.id, %{name: nil}))
  end

  test "does not update stories position or state", %{project: project} do
    {:ok, created} = Stories.create(project.id, @valid_story_params)
    {:ok, updated} = Stories.update(created.id, %{state: "new state", position: 999})

    found = Repo.get(Story, updated.id)

    assert found.state != "new state"
    assert found.position != 999
  end

  test "finds all by state", %{project: project} do
    ready = create_in_state(project.id, "ready")
    working = create_in_state(project.id, "working")

    %{"ready" => [found_in_ready], "working" => [found_in_working]} = Stories.by_state(project.id)

    assert found_in_ready.id == ready.id
    assert found_in_working.id == working.id
  end

  test "does not find stories that are not part of the project", %{project: project} do

    {:ok, project2} = Artisan.Projects.create(%{name: "project2"})
    create_in_state(project2.id, "ready")

    found = Stories.by_state(project.id)

    assert Enum.all?(found, fn({_col, stories}) -> Enum.empty?(stories) end)
  end
end
