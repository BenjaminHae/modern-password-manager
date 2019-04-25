FROM php:7-fpm

# RUN apt-get update && apt-get install

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && composer --version

WORKDIR /
