#!/bin/sh
cd ..
# symfony
docker run --user ${UID}:${GID} --rm -v ${PWD}:/local openapitools/openapi-generator-cli:latest generate -i /local/OpenAPIDescription.yaml     -g php-symfony -o /local/OpenAPIServerBundle
# angular
docker run --user ${UID}:${GID} --rm -v ${PWD}:/local openapitools/openapi-generator-cli:latest generate -i /local/OpenAPIDescription.yaml     -g typescript-angular -o /local/OpenAPIAngularClient --additional-properties npmName=@pm-server/pm-server
