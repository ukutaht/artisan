.PHONY: build build_core build_core_prod build_app build_app_prod check deploy

build: build_core build_app

deploy: build_production_tarball
	scp artisan.tar.gz ubuntu@ec2-52-51-96-58.eu-west-1.compute.amazonaws.com:/home/ubuntu
	ssh ubuntu@ec2-52-51-96-58.eu-west-1.compute.amazonaws.com 'cd /app && tar xfz /home/ubuntu/artisan.tar.gz && bin/artisan stop && sudo start artisan_api'

build_production_tarball: build_core_prod build_app_prod
	mv rel/artisan/releases/0.0.1/artisan.tar.gz . && \
	gunzip artisan.tar.gz && \
	tar -uf artisan.tar app/public && \
	gzip artisan.tar

build_core:
	mix deps.get && MIX_ENV=test mix compile

build_core_prod:
	MIX_ENV=prod mix release

build_app:
	npm install && node_modules/brunch/bin/brunch build -j

build_app_prod:
	node_modules/brunch/bin/brunch build -j --production

check: check_core check_app

check_core:
	mix test

check_app:
	npm run test
