defmodule Artisan.Users.PasswordTest do
  use ExUnit.Case, async: true
  alias Artisan.Users.Password

  test "uses random salt to hash password" do
    hash1 = Password.hash("pw")
    hash2 = Password.hash("pw")

    assert hash1 != hash2
  end

  test "checks whether passwords match" do
    hash = Password.hash("pw")

    assert Password.match?("pw", hash)
    refute Password.match?("wrong", hash)
  end
end
