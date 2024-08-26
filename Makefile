setup: 
	npm install
	npm run build

clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage

run:
	node ./dist/index.js

test:
	npm test
	
coverage:
	npm run test:coverage
