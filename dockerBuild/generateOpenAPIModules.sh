#!/bin/sh
cd ..
# symfony
GENERATOR=openapitools/openapi-generator-cli:v5.0.0-beta

docker run --userns=host --user ${UID}:${GID} --rm -v ${PWD}:/local "${GENERATOR}" generate -i /local/OpenAPIDescription.yaml     -g php-symfony -o /local/OpenAPIServerBundle
# react
docker run --userns=host --user ${UID}:${GID} --rm -v ${PWD}:/local "${GENERATOR}" generate -i /local/OpenAPIDescription.yaml     -g typescript-fetch -o /local/OpenAPIReactClient --additional-properties npmName=@pm-server/pm-server-react-client
