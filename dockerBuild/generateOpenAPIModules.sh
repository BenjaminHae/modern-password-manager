#!/bin/sh
cd ..
# symfony
docker run --userns=host --user ${UID}:${GID} --rm -v ${PWD}:/local openapitools/openapi-generator-cli:latest generate -i /local/OpenAPIDescription.yaml     -g php-symfony -o /local/OpenAPIServerBundle
# react
docker run --userns=host --user ${UID}:${GID} --rm -v ${PWD}:/local openapitools/openapi-generator-cli:latest generate -i /local/OpenAPIDescription.yaml     -g typescript-fetch -o /local/OpenAPIReactClient --additional-properties npmName=@pm-server/pm-server-react-client
