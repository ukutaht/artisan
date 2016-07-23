.PHONY: clean build build_core build_app check

build: build_core build_app

build_core:
	cd core && mix deps.get && MIX_ENV=test mix compile && cd ..

build_app:
	cd app && npm install && node_modules/brunch/bin/brunch build -j && cd ..

check: check_core check_app

check_core:
	cd core && mix test && cd ..

check_app:
	cd app && npm run test && cd ..

clean:
	rm -rf core/_build \
	rm -rf core/deps \
	rm -rf app/public \
	rm -rf app/node_modules

