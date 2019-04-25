#!/bin/sh
# Build Angular OpenAPI Client
cd app/OpenAPIAngularClient/
npm install
npm run build
cd ../angularClient
npm install
rm -rf "node_modules/@pm-server/pm-server"
cp -r "../OpenAPIAngularClient/dist" "node_modules/@pm-server/pm-server"
ng serve --host 0.0.0.0 --disable-host-check
