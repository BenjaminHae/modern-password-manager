FROM node:12 as build-frontend
COPY . /app
WORKDIR /app/reactClient/my-app
RUN npm install --quiet
RUN npm link ../../OpenAPIReactClient/
RUN npm run build

FROM composer:2 as build-backend
COPY . /app
WORKDIR /app/Symfony-API
RUN composer -q install --no-dev --no-progress --optimize-autoloader --classmap-authoritative
COPY --from=build-frontend /app/reactClient/my-app/build/ /app/Symfony-API/public/
RUN rm ./templates/base.html.twig && ln -s ../public/index.html ./templates/index.html

WORKDIR /app/Symfony-API/vendor/openapi
RUN rm server-bundle && cp -r ../../../OpenAPIServerBundle/ server-bundle

FROM php:7.4-apache

ENV APACHE_DOCUMENT_ROOT /app/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite

COPY --from=build-backend /app/Symfony-API /app
RUN echo "DATABASE_URL=\"sqlite:////app/var/pwman.sqlite\"" > /app/.env.local
RUN cd /app/ && php bin/console doctrine:schema:update --force
RUN chown -R www-data:www-data /app/var

