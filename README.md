# Modern password manager

This is a web-based password manager that can be self-hosted.
All stored accounts are encrypted on the client-side. Neither the key for encryption nor the plain passwords (or other account data) are ever transmitted to the server.

The backend is based on php using the symfony framework.  
The frontend is based on react-typescript.

For login you can use [WebAuthN](https://en.wikipedia.org/wiki/WebAuthn) using platform authenticators. That means logging in using your fingerprint sensor or something similar is possible. Setup is located in the Settings in the web interface.

There also is a [Browser Extension](https://github.com/BenjaminHae/MPMChromeExtension/) ([chrome web store](https://chrome.google.com/webstore/detail/modern-password-manager/nicghopbfhgnjbbkdhkhaiekhpdjdfge)).

For quick testing you can use the docker image provided through ghcr:

    docker run -p 443:443 ghcr.io/benjaminhae/modern-password-manager:latest


## Features

 - All data is encrypted before it is sent to the server
 - Custom fields for accounts
 - [Browser Extension](https://github.com/BenjaminHae/MPMChromeExtension/) ([chrome web store](https://chrome.google.com/webstore/detail/modern-password-manager/nicghopbfhgnjbbkdhkhaiekhpdjdfge))
 - Extensions can be implemented in a simple way
 - Login using biometrics
 - Stable API, so other clients (such as cli) can be implemented

## Screenshots

List of accounts (main view):  
<img alt="Account List" src="./docs/Account_List.png" width="500"/>

Editing an account:  
<img alt="Editing an account" src="./docs/Account_Edit.png" width="300"/>

Importing accounts from a csv file:  
<img alt="Importing accounts from csv" src="./docs/Account_Import.png" width="500"/>

## Installation

### Productive use

You need a webspace with PHP 7.4.

 1. Extract the ZIP file for the release to your server. Point apache to the folder `public`
 2. Copy the configuration file `.env` to `.env.local` and adjust the contents to your needs.
    You need to at least setup the database connection:
    ```
    DATABASE_URL=mysql://user:password@127.0.0.1:3306/database_name?serverVersion=mariadb-10.3.23
    ```
    Also update the APP_SECRET variable to a new random value (32 hex characters).
 3. Afterwards run the script bin/console like that:
    ```
    bin/console doctrine:schema:update --force
    ```
 4. Clean up. You may remove the following files/folders:
    - `Dockerfile`
    - `docker-compose.yml`
    - `bin` (if you still need the symfony console, leave this folder)
    
The password manager only works when you access it through https or on localhost, otherwise current browsers do not accept it as secure origin and do not offer the cryptography APIs.

### Docker - sqlite (only for testing purposes)

With this variant a docker container is started that uses a sqlite database.

 1. run `docker build -t mpm .` in the extracted release (or in the repository itself).
 2. start the container: `docker run --name mpm -p 443:443 mpm`
 3. Visit [https://localhost](https://localhost)
 4. If you have used the database in a previous version, you need to upgrade the database (while the container is running).  
    - This can be done automatically which is a bit dangerous:  
      `docker exec mpm /bin/sh -c "/app/bin/console doctrine:schema:update --force"`
    - Or you can view the necessary sql statements and do them yourself:   
      `docker exec mpm /bin/sh -c "/app/bin/console doctrine:schema:update --dump-sql"`

Data is stored within the container in `/data` and not persisted between container runs by default!

### docker-compose - with mariadb

With this variant a docker container for the application and a database service that persists the data is created:
 1. Change every occurence of `CHANGEME` in `docker-compose.yml` to some secret password, this is the password for the database.
 2. Change the value of the environment variable `APP_SECRET` for the service `mpm` to a new random value (32 hex characters). 
 3. run `docker-compose --env-file /dev/null up -d` within the path of your local copy of this repository.
 4. run `docker-compose --env-file /dev/null exec mpm /bin/sh -c "/app/bin/console doctrine:schema:update --force"` to upgrade the database
 5. visit your password-manager on `https://localhost`


## Manual build

### Building React client

 1. Do everything in `reactClient/my-app/`
 2. Use Node 12.x
 3. run `npm install`
 4. run `npm link OpenAPIReactClient/`
 5. run `npm run build`

### Deploying PHP

 1. Copy the whole repository to your server
 2. Go to the `Symfony-API/` directory
 3. Run `composer install --no-dev --no-suggest --optimize-autoloader --classmap-authoritative`.  
 4. Copy the results of the react-build to `Symfony-API/public/`. Also copy the file `index.html` to `Symfony-API/templates/` (creating a symlink also works).
 
 5. Copy the `.env` file to `.env.local` and fill in your database information in the variable `DATABASE_URL`. Also regenerate `APP_SECRET` to a random hex-string that has 32 characters (16 byte).
    Example database strings:
    - Mariadb: `mysql://user:password@127.0.0.1:3306/database_name?serverVersion=mariadb-10.3.23`
    - Sqlite: `sqlite:////data/pwman.sqlite`
 6. Prepare the database by running the SQL generated by `php bin/console doctrine:schema:update --dump-sql` in it.
 7. Configure your webserver with `Symfony-API/public/` as root-directory.
 8. Make sure to use HTTPS, otherwise nothing will work.  
    (This is a restriction by the browsers, the JavaScript APIs in use are only available in a secure context: `https://*` or `localhost`)
 9. Visit your webpage using `https`

### Cleaning up

The following files/directories are not needed at runtime:

 - OpenAPIDescription.yaml
 - OpenAPIReactClient/
 - README.md
 - dockerBuild/
 - reactClient/
 - Symfony-API/bin/

