defmodule Artisan.ErrorHelper do
  def serialize_errors(changeset) do
    errors = Enum.reduce(changeset.errors, %{}, fn({field, {msg, _meta}}, acc) ->
      errors_on_field = Map.get(acc, field, [])
      Map.put(acc, field, errors_on_field ++ [msg])
    end)

  %{errors: errors}
  end
end
