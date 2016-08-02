defmodule Artisan.Users.Email.Emails do
  use Bamboo.Phoenix, view: Artisan.Users.Email.View

  def invite(email, project_id) do
    base_email
      |> to(email)
      |> subject("You've been invited to join Artisan")
      |> render(:invite)
  end

  defp base_email do
    new_email(from: "noreply@artisan-app.com")
  end
end
