defmodule Artisan.Users.Token do
  @two_weeks 1209600

  def sign(user_id) do
    Phoenix.Token.sign(Artisan.Endpoint, "user", user_id)
  end

  def verify(token) do
    Phoenix.Token.verify(Artisan.Endpoint, "user", token, max_age: @two_weeks)
  end
end
