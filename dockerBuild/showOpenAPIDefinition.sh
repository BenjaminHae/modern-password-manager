#!/bin/sh
cd ..
docker run -d --rm -p 81:8080 -e SWAGGER_JSON=/foo/OpenAPIDescription.yaml -v ${PWD}:/foo swaggerapi/swagger-ui
