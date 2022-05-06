install:
	npm ci

lint:
	npx eslint .

test:
	npx jest

test-coverage:
	npx jest --coverage

develop:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack
