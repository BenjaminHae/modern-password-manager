#!/bin/sh
# Build Angular OpenAPI Client
cd app/OpenAPIAngularClient/
npm install
npm run build
cd dist
npm install
cd ../../angularClient
npm install
rm -rf "node_modules/@pm-server/pm-server"
cp -r "../OpenAPIAngularClient/dist" "node_modules/@pm-server/pm-server"
rm -r "node_modules/@pm-server/pm-server/node_modules"
ng build --prod
ng serve --host 0.0.0.0 --disable-host-check
