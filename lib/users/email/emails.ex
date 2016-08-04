defmodule Artisan.Users.Email.Emails do
  use Bamboo.Phoenix, view: Artisan.Users.Email.View
  @from "Artisan <noreply@artisan-app.com>"
  @invite_subject "[Artisan] You've been invited to join Artisan"

  def invite(inviter, email, nil) do
    link = base_url() <> "/signup"

    base_email
      |> to(email)
      |> subject(@invite_subject)
      |> render(:invite, inviter: inviter, link: link)
  end

  def invite(inviter, email, project) do
    token = generate_invite_token(email, project) |> URI.encode_www_form
    link = base_url() <> "/signup?token=" <> token

    base_email
      |> to(email)
      |> subject(@invite_subject)
      |> render(:invite_to_project, inviter: inviter, link: link, project: project)
  end

  def generate_invite_token(email, nil) do
    Phoenix.Token.sign(Artisan.Endpoint, "invite", %{email: email, project_id: nil})
  end

  def generate_invite_token(email, project) do
    Phoenix.Token.sign(Artisan.Endpoint, "invite", %{email: email, project_id: project.id})
  end

  defp base_url do
    Artisan.Router.Helpers.url(Artisan.Endpoint)
  end

  defp base_email do
    new_email(from: @from)
  end
end
