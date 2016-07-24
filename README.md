# Artisan

[![CircleCI](https://circleci.com/gh/ukutaht/artisan.svg?style=svg)](https://circleci.com/gh/ukutaht/artisan)

8th Lights's project management tool. This is a complete rewrite of the original artisan using
Phoenix on the backend and ES6 + React on the frontend for learning purposes.

### Dependencies

To run the app locally, you need Erlang, Elixir, Postgres and Node installed on your machine.
There is a `.tool-versions` file in the project root which lists versions that are known to work properly.
Please follow the official instructions to get all of that up and running.

Setup the application:
  * `mix deps.get` -> If you run into trouble for not having `hex` installed, go ahead and get it: `mix local.hex`.
  * `npm install`
  * `mix ecto.create && mix ecto.migrate`

### Running

Run `mix phoenix.server` and the app should be running on [`localhost:4000`](http://localhost:4000). This command
also starts a watcher for the frontend assets and reloads backend code so there shouldn't be any need to restart
the server in development.

### Tests

The app has two test suites: one for the elixir backend and one for the javascript on the frontend. You can
run them individually with these two commands:
```
mix test
npm run test
```

If you want to run the whole thing, there's a script at `rel/test` which runs both test suites
and lints the code as well.

### Continous {Integration,Deliver}

All pull requests are built, tested and linted using the `rel/test` command. Make sure that passes before
submitting a PR. The master branch is automatically deployed to staging after a sucessful build.
