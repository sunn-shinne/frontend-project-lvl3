install:
	npm ci

lint:
	npx eslint .

test:
	# npx jest
	NODE_OPTIONS=--experimental-vm-modules npx jest

test-coverage:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

develop:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack
