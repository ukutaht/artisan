defmodule Artisan.HealthControllerTest do
  use Artisan.ConnCase

  test "responds 200 OK" do
    res = build_conn()
      |> get("/api/health")
      |> json_response(200)

    assert res["database"] == "ok"
    assert res["sha"]
  end
end
