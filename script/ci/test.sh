#!/bin/bash

export MIX_ENV="test"
export PATH="$HOME/dependencies/erlang/bin:$HOME/dependencies/elixir/bin:$PATH"

cd core
mix test
