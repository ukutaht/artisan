defmodule Artisan.Project.Test do
  use Artisan.ModelCase
  alias Artisan.Project

  test "can create a valid project" do
    changes = Project.new(%Project{}, %{name: "Name"})
      |> Project.add_slug("slug")

    assert changes.valid?
  end

  test "validates presence of name when creating new" do
    changes = Project.new(%Project{}, %{name: ""})

    assert changes.errors[:name]
  end

  test "validates presence of slug" do
    changes = Project.add_slug(%Project{name: "name"}, "")

    assert changes.errors[:slug]
  end

  test "validates that slug is lowercase" do
    changes = Project.add_slug(%Project{name: "name"}, "ASD")

    assert changes.errors[:slug]
  end

  test "validates that slug is does not have special characters" do
    changes = Project.add_slug(%Project{name: "name"}, "£$??")

    assert changes.errors[:slug]
  end
end
