FROM node:12 as build-frontend
RUN mkdir -p /app/reactClient/my-app
COPY ./reactClient/my-app/package*.json /app/reactClient/my-app/
WORKDIR /app/reactClient/my-app
RUN npm install --quiet
COPY . /app
RUN npx browserslist@latest --update-db
RUN npm link ../../OpenAPIReactClient/
RUN npm run build

FROM composer:2 as build-backend
COPY . /app
WORKDIR /app/Symfony-API
RUN composer -q install --no-dev --no-progress --optimize-autoloader --classmap-authoritative
COPY --from=build-frontend /app/reactClient/my-app/build/ /app/Symfony-API/public/
RUN rm ./templates/base.html.twig && rm ./templates/index.html && ln -s ../public/index.html ./templates/index.html

WORKDIR /app/Symfony-API/vendor/openapi
RUN rm -r server-bundle && cp -r ../../../OpenAPIServerBundle/ server-bundle

FROM php:8.1-apache
RUN docker-php-ext-install pdo_mysql

ENV APACHE_DOCUMENT_ROOT /app/public

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y ssl-cert && \
    rm -r /var/lib/apt/lists/*
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite && \
    a2enmod ssl && \
    a2ensite default-ssl

COPY --from=build-backend /app/Symfony-API /app
RUN mkdir /data && \
    echo "DATABASE_URL=\"sqlite:////data/pwman.sqlite\"" > /app/.env.local && chown -R www-data:www-data /data
RUN cd /app/ && php bin/console doctrine:schema:update --force
RUN chown -R www-data:www-data /app

