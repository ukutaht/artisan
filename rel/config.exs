use Mix.Releases.Config,
  default_release: :default,
  default_environment: :prod

environment :prod do
  set include_erts: true
  set include_src: false
end

release :artisan do
  set version: current_version(:artisan)
end

