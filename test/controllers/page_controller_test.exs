defmodule Artisan.PageControllerTest do
  use Artisan.ConnCase

  test "GET /" do
    conn = get conn(), "/"
    assert conn.status == 200
  end
end
