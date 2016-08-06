defmodule Artisan.Iteration.Test do
  use Artisan.ModelCase
  alias Artisan.Iteration

  test "can create a valid iteration" do
    changes = Iteration.changeset(%Iteration{}, %{number: 123, state: "planning", project_id: 1})

    assert changes.valid?
  end

  test "validates presence of number" do
    changes = Iteration.changeset(%Iteration{}, %{state: "planning", project_id: 1})

    assert changes.errors[:number]
  end

  test "validates presence of state" do
    changes = Iteration.changeset(%Iteration{}, %{number: 123, project_id: 1})

    assert changes.errors[:state]
  end

  test "validates presence of project_id" do
    changes = Iteration.changeset(%Iteration{}, %{number: 123, state: "planning"})

    assert changes.errors[:project_id]
  end

  test "validates that state is one of the predefined states" do
    invalid = Iteration.changeset(%Iteration{}, %{number: 123, state: "blah", project_id: 1})
    planning = Iteration.changeset(%Iteration{}, %{number: 123, state: "planning", project_id: 1})
    working = Iteration.changeset(%Iteration{}, %{number: 123, state: "working", project_id: 1})
    completed = Iteration.changeset(%Iteration{}, %{number: 123, state: "completed", project_id: 1})

    refute invalid.valid?
    assert planning.valid?
    assert working.valid?
    assert completed.valid?
  end
end
