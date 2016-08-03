defmodule Artisan.Users.InviteToken do
  @a_day 86_400

  def sign(data) do
    Phoenix.Token.sign(Artisan.Endpoint, "invite", data)
  end

  def verify(token) do
    Phoenix.Token.verify(Artisan.Endpoint, "invite", token, max_age: @a_day)
  end
end
