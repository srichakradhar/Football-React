#!/bin/sh
cd nodejs/
npm stop
node_modules/.bin/pm2 start -f src/index.js --watch
cd ..
npm start
