defmodule Artisan.Projects.ControllerTest do
  use Artisan.ConnCase
  import Artisan.Test.APIHelpers

  @valid_project_params %{
    name: "name"
  }

  setup do
    user = create_user()

    {:ok, user: user}
  end

  test "creates a new project when valid", %{user: user} do
    res = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    assert res["name"] == "name"
  end

  test "finds a project", %{user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    found = authenticated_conn(user["token"])
      |> get("/api/projects/#{created["slug"]}")
      |> json_response(200)

    assert found["name"] == created["name"]
  end

  test "finds collaborators for a project", %{user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    %{"collaborators" => [found]} = authenticated_conn(user["token"])
      |> get("/api/projects/#{created["slug"]}")
      |> json_response(200)

    assert found["name"] == user["user"]["name"]
  end

  test "runs autocomplete search for collaborators", %{user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    create_user(email: "something@email.com")

    [found] = authenticated_conn(user["token"])
      |> get("/api/projects/#{created["id"]}/collaborators/autocomplete?q=something")
      |> json_response(200)

    assert found["email"] == "something@email.com"
  end

  test "removes collaborator from project", %{user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    user2 = create_user(email: "something@email.com")

    authenticated_conn(user["token"])
      |> post("/api/projects/#{created["id"]}/collaborators", %{user_id: user2["user"]["id"]})
      |> json_response(200)

    authenticated_conn(user["token"])
      |> delete("/api/projects/#{created["id"]}/collaborators/#{user2["user"]["id"]}")
      |> json_response(200)

    %{"collaborators" => collaborators} = authenticated_conn(user["token"])
      |> get("/api/projects/#{created["slug"]}")
      |> json_response(200)

    assert Enum.count(collaborators) == 1
  end

  test "adds collaborator to project", %{user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    user2 = create_user(email: "something@email.com")

    authenticated_conn(user["token"])
      |> post("/api/projects/#{created["id"]}/collaborators", %{user_id: user2["user"]["id"]})
      |> json_response(200)

    %{"collaborators" => collaborators} = authenticated_conn(user["token"])
      |> get("/api/projects/#{created["slug"]}")
      |> json_response(200)

    assert Enum.count(collaborators) == 2
  end

  test "updates a project", %{user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    updated = authenticated_conn(user["token"])
      |> put("/api/projects/#{created["id"]}", %{project: %{name: "New name"}})
      |> json_response(200)

    assert updated["name"] == "New name"
  end

  test "returns errors when project is invalid", %{user: user} do
    created = authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})
      |> json_response(200)

    res = authenticated_conn(user["token"])
      |> put("/api/projects/#{created["id"]}", %{project: %{name: ""}})
      |> json_response(400)

    assert res["errors"]["name"] == ["can't be blank"]
  end

  test "gets all projects", %{user: user} do
    authenticated_conn(user["token"])
      |> post("/api/projects", %{project: @valid_project_params})

    res = authenticated_conn(user["token"])
      |> get("/api/projects")
      |> json_response(200)

    assert Enum.count(res) == 1
  end
end
