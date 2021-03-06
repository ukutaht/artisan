defmodule Artisan.Projects.SlugTest do
  use Artisan.ModelCase
  alias Artisan.Projects.Slug

  test "generates a slug based on name" do
    assert Slug.generate("Project Name") == "project-name"
  end

  test "increments slug number if it already exists" do
    Helpers.create_project(slug: "name")
    assert Slug.generate("name") == "name-1"
  end

  test "increments slug number if previously incremented slug number exists" do
    Helpers.create_project(slug: "name")
    Helpers.create_project(slug: "name-1")

    assert Slug.generate("name") == "name-2"
  end

  test "ignores non-numbers after dash" do
    Helpers.create_project(slug: "name")
    Helpers.create_project(slug: "name-something-else")

    assert Slug.generate("name") == "name-1"
  end
end
