.PHONY: build build_core build_core_prod build_app build_app_prod check deploy

build: build_core build_app

deploy: build_production_tarball
	scp artisan.tar.gz ubuntu@ec2-52-51-96-58.eu-west-1.compute.amazonaws.com:/home/ubuntu
	ssh ubuntu@ec2-52-51-96-58.eu-west-1.compute.amazonaws.com 'cd /app && tar xfz /home/ubuntu/artisan.tar.gz && bin/artisan stop && sudo start artisan_api'

build_production_tarball: build_core_prod build_app_prod
	mv core/rel/artisan/releases/0.0.1/artisan.tar.gz . && \
	gunzip artisan.tar.gz && \
	tar -uf artisan.tar app/public && \
	gzip artisan.tar

build_core:
	cd core && mix deps.get && MIX_ENV=test mix compile && cd ..

build_core_prod:
	cd core && MIX_ENV=prod mix release && cd ..

build_app:
	cd app && npm install && node_modules/brunch/bin/brunch build -j && cd ..

build_app_prod:
	cd app && node_modules/brunch/bin/brunch build -j --production && cd ..

check: check_core check_app

check_core:
	cd core && mix test && cd ..

check_app:
	cd app && npm run test && cd ..
