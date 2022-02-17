FROM node:12 as build-frontend
RUN mkdir -p /app/reactClient/my-app
COPY ./reactClient/my-app/package*.json /app/reactClient/my-app/
WORKDIR /app/reactClient/my-app
RUN npm install --quiet
COPY ./OpenAPIReactClient /app/OpenAPIReactClient
WORKDIR /app/OpenAPIReactClient
RUN npm install --quiet && npm run build
WORKDIR /app/reactClient/my-app
COPY ./reactClient /app/reactClient
RUN npm install /app/OpenAPIReactClient
RUN npm run build

FROM php:8.1 as build-backend
COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN apt-get update && apt-get install -y \
        libzip-dev \
        zip \
  && docker-php-ext-install zip
# copy dependencies and package files
RUN mkdir -p /app/Symfony-API
COPY ./OpenAPIServerBundle /app/OpenAPIServerBundle
COPY ./Symfony-API /app/Symfony-API
WORKDIR /app/Symfony-API
RUN composer install --no-dev --no-progress --optimize-autoloader --classmap-authoritative

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

