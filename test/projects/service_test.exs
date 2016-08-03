defmodule Artisan.ProjectsTest do
  use Artisan.ModelCase
  alias Artisan.Projects
  alias Artisan.Project

  @valid_project_params %{
    name: "Name",
  }

  @invalid_project_params %{
    name: nil
  }

  setup do
    {:ok, %{current_user: Helpers.create_user()}}
  end

  test "creates a project with valid params", %{current_user: current_user} do
    {:ok, _} = Projects.create(current_user.id, @valid_project_params)

    assert Repo.aggregate(Project, :count, :id) == 1
  end

  test "automatically creates the first iteration when creating project", %{current_user: current_user} do
    {:ok, _} = Projects.create(current_user.id, @valid_project_params)

    assert Repo.aggregate(Artisan.Iteration, :count, :id) == 1
  end

  test "automatically adds current user as collaborator", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)

    assert Projects.is_collaborator?(project.id, current_user.id)
  end

  test "automatically generates slug for project", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)

    assert project.slug == "name"
  end

  test "appends numbers to ensure slugs are unique", %{current_user: current_user} do
    {:ok, project1} = Projects.create(current_user.id, @valid_project_params)
    assert project1.slug == "name"
    {:ok, project2} = Projects.create(current_user.id, @valid_project_params)
    assert project2.slug == "name-1"
    {:ok, project3} = Projects.create(current_user.id, @valid_project_params)

    assert project3.slug == "name-2"
  end

  test "does not create a project with invalid params", %{current_user: current_user} do
    {:error, _} = Projects.create(current_user.id, @invalid_project_params)

    assert Repo.aggregate(Project, :count, :id) == 0
  end

  test "finds a project", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)

    found = Projects.find(current_user.id, project.slug)

    assert found.name == project.name
  end

  test "finds collaborators for a project", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)

    [%{id: collaborator_id}] = Projects.find(current_user.id, project.slug).collaborators

    assert collaborator_id == current_user.id
  end

  test "finds project by id", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)

    found = Projects.find_by_id(current_user.id, project.id)

    assert found.name == project.name
  end

  test "removes collaborator for project", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    user2 = Helpers.create_user(email: "user2@email.com")
    :ok = Projects.add_collaborator(project.id, user2.id)
    :ok = Projects.remove_collaborator(project.id, user2.id)

    refute Projects.is_collaborator?(project.id, user2.id)
  end

  test "can add a collaborator", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    user2 = Helpers.create_user(email: "user2@email.com")
    :ok = Projects.add_collaborator(project.id, user2.id)

    assert Projects.is_collaborator?(project.id, user2.id)
  end

  test "can search for potential collaborators by name", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    user2 = Helpers.create_user(email: "name@email.com")

    ids = Projects.autocomplete_collaborators(project.id, "name")
      |> Enum.map(&(&1.id))

    assert ids == [user2.id]
  end


  test "can search for potential collaborators by email", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    user2 = Helpers.create_user(email: "account@email.com")
    Helpers.create_user(email: "irrelevant@email.com")

    ids = Projects.autocomplete_collaborators(project.id, "account")
      |> Enum.map(&(&1.id))

    assert ids == [user2.id]
  end

  test "excludes existing collaborators from search", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    user2 = Helpers.create_user(email: "account@email.com")
    :ok = Projects.add_collaborator(project.id, user2.id)

    results = Projects.autocomplete_collaborators(project.id, "account")

    assert results == []
  end

  test "does not find a project if user is not a collaborator", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    someone_else = 999

    assert Projects.find(someone_else, project.slug) == nil
  end

  test "updates a project", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    {:ok, updated} = Projects.update(current_user.id, project.id, %{name: "New name"})

    assert updated.name == "New name"
  end

  test "does not allow invalid updates", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    {:error, _} = Projects.update(current_user.id, project.id, %{name: ""})

    assert Repo.get(Project, project.id).name == project.name
  end

  test "does not update project if user is not a collaborator", %{current_user: current_user} do
    {:ok, project} = Projects.create(current_user.id, @valid_project_params)
    someone_else = 9999999
    res = Projects.update(someone_else, project.id, %{name: "New name"})

    assert res == {:error, "Not Found"}
  end

  test "finds all projects for a user", %{current_user: current_user} do
    user2 = Helpers.create_user(email: "account@email.com")

    {:ok, project1} = Projects.create(current_user.id, @valid_project_params)
    {:ok, project2} = Projects.create(current_user.id, %{@valid_project_params | name: "name2"})
    {:ok, _not_ours} = Projects.create(user2.id, %{@valid_project_params | name: "name3"})

    assert Projects.all(current_user.id) == [project1, project2]
  end
end

