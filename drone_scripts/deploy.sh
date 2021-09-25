#!/bin/sh
set -x
apk update
apk add zip openssh-client
# setup ssh
mkdir ~/.ssh
echo ${SSH_PRIVATE_KEY} | base64 -d > ~/.ssh/id_drone
chmod 0600 ~/.ssh/id_drone
echo ${SSH_HOST_KEY} | base64 -d > ~/.ssh/known_hosts
chmod 0600 ~/.ssh/known_hosts
# create zip archive
(cd ./Symfony-API && zip -q --symlinks -r ../mpm.zip .)
# transfer to host
scp -i ~/.ssh/id_drone mpm.zip "${SSH_USER}@${SSH_HOST}:${COPY_REMOTE_PATH}"
# clear destination
ssh -i ~/.ssh/id_drone "${SSH_USER}@${SSH_HOST}" "/bin/sh -c 'cd ${DEPLOY_PATH} && ls -1'"
# | xargs rm -r
# extract to destination
ssh -i ~/.ssh/id_drone ${SSH_USER}@${SSH_HOST} "unzip -o -q ${COPY_PATH} -d ${DEPLOY_PATH} && rm ${COPY_PATH}"
# execute db update
ssh -i ~/.ssh/id_drone "${SSH_USER}@${SSH_HOST}" "cd ${DEPLOY_PATH} && ${PHP_VERSION} bin/console doctrine:schema:update --dump-sql && ${PHP_VERSION} bin/console doctrine:schema:update --force && ${PHP_VERSION} bin/console cache:clear"
