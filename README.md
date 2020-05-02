# About
This theme is a NuxtJS / VueJS frontent for a headless Wordpress installation running the WPGraphQL plugin. It is a work in progress and meant as starting point for anyone wishing to create a Nuxt+Tailwind theme that consumes data via a Wordpress + WPGraphQL plugin API.

## Wordpress Theme setup   
You will need wordpress set up correctly! I have dockerized a simple starting point here
https://github.com/caudurodev/docker-compose-headless-wordpress-ssl-nuxt

Edit the .env file to point to your API endpoint before starting nuxt.

Run in development mode
$ npm run dev

Run for production
$npm run build && npm start


### Menus
Menus in Wordpress need to be name "main" and "footer" to show up




