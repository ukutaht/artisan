defmodule Artisan.Users.Email.Emails do
  use Bamboo.Phoenix, view: Artisan.Users.Email.View
  @from "Artisan <noreply@artisan-app.com>"
  @invite_subject "[Artisan] You've been invited to join Artisan"

  def invite(inviter, email, nil) do
    link = "http://localhost:4000/signup?email=#{email}"

    base_email
      |> to(email)
      |> subject(@invite_subject)
      |> render(:invite, inviter: inviter, link: link)
  end

  def invite(inviter, email, project) do
    link = "http://localhost:4000/signup?email=#{email}"

    base_email
      |> to(email)
      |> subject(@invite_subject)
      |> render(:invite_to_project, inviter: inviter, link: link, project: project)
  end

  defp base_email do
    new_email(from: @from)
  end
end
