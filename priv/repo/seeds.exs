project = Artisan.Repo.insert!(%Artisan.Project{name: "Test project"})

story_params = %{
  project_id: project.id,
  estimate: 2.25,
  optimistic: 1,
  realistic: 1,
  pessimistic: 2,
  tags: []
}

Enum.each(1..300, fn(n) ->
  story = %Artisan.Story{}
    |> Map.merge(story_params)
    |> Map.put(:state, "backlog")
    |> Map.put(:name, "Story #{n}")
    |> Map.put(:number, n)
    |> Map.put(:position, n)

  Artisan.Repo.insert!(story)
end)

Enum.each(300..600, fn(n) ->
  story = %Artisan.Story{}
    |> Map.merge(story_params)
    |> Map.put(:state, "ready")
    |> Map.put(:name, "Story #{n}")
    |> Map.put(:number, n)
    |> Map.put(:position, n)

  Artisan.Repo.insert!(story)
end)

Enum.each(600..900, fn(n) ->
  story = %Artisan.Story{}
    |> Map.merge(story_params)
    |> Map.put(:state, "working")
    |> Map.put(:name, "Story #{n}")
    |> Map.put(:number, n)
    |> Map.put(:position, n)

  Artisan.Repo.insert!(story)
end)

Enum.each(900..1200, fn(n) ->
  story = %Artisan.Story{}
    |> Map.merge(story_params)
    |> Map.put(:state, "completed")
    |> Map.put(:name, "Story #{n}")
    |> Map.put(:number, n)
    |> Map.put(:position, n)

  Artisan.Repo.insert!(story)
end)
