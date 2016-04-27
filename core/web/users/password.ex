defmodule Artisan.Users.Password do
  alias Comeonin.Bcrypt

  def hash(password) do
    Bcrypt.hashpwsalt(password)
  end

  def match?(password, hash) do
    Bcrypt.checkpw(password, hash)
  end
end
