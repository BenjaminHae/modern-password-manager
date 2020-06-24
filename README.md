# Modern password manager

## Building React client

 todo

## Deployment

 1. Copy the whole repository to your server
 2. Go to the `Symfony-API/` directory
 2. Run `composer install`.  
    and for apache: `composer require symfony/apache-pack`
 3. Copy the `.env` file to `.env.local` and fill in your database information. Also regenerate `APP_SECRET`.
 4. Prepare the database by running the SQL generated by `php bin/console doctrine:schema:update --dump-sql` in it.
 5. Copy the results of the react-build to `Symfony-API/public/`. Also copy the file `index.html` to `Symfony-API/templates/`.
 6. Configure your webserver with `Symfony-API/public/` as root-directory.
 7. Make sure to use HTTPS, otherwise nothing will work.  
    (This is a restriction by the browsers, the JavaScript APIs in use are only available in a secure context: `https://*` or `localhost`)
 8. Visit your webpage
