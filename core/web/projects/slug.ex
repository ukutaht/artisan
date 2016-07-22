defmodule Artisan.Projects.Slug do
  use Artisan.Web, :model
  alias Artisan.Project

  def generate(name) do
    slug = Slugger.slugify_downcase(name)

    if taken?(slug) do
      increment(slug)
    else
      slug
    end
  end

  defp taken?(slug) do
    Repo.aggregate(from(p in Project, where: p.slug == ^slug), :count, :id) > 0
  end

  defp increment(slug) do
    regex = "#{slug}-(\\d)"
    matching = Repo.all(from p in Project,
      where: fragment("substring(? FROM ?) is not null", p.slug, ^regex),
      select: fragment("substring(? FROM ?)::int as slug_number", p.slug, ^regex)
    )

    if Enum.empty?(matching) do
      "#{slug}-1"
    else
      "#{slug}-#{Enum.max(matching) + 1}"
    end
  end
end

