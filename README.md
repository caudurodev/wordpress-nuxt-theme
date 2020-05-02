# About
This theme is a NuxtJS / VueJS frontent for a headless Wordpress installation running the WPGraphQL plugin. It is a work in progress and meant as starting point for anyone wishing to create a Nuxt+Tailwind theme that consumes data via a Wordpress + WPGraphQL plugin API.

## Wordpress Theme setup   
You will need wordpress set up correctly! I have dockerized a simple starting point here:

https://github.com/caudurodev/docker-compose-headless-wordpress-ssl-nuxt

Note: your wordpress must be set up to allow CORS if you are running your frontend in a different port or domain. In the above docker setup I have added a caching plugin which enables CORS (in the other github repo).

Example that will cause CORS error: 
- Wordpress on http://localhost
- Nuxt on http://localhost:3000

### Menus
Menus in Wordpress need to be named "main" and "footer" to show up in header and footer.

### Advanced Custom Fields Wordpress Plugin
There is a free plugin form the WPGraphQL team which integrates with the paid and free versions of ACF. You can get it here and I recommend it as Worpress is quite limited in setting up custom fields:
https://docs.wpgraphql.com/ (sidebar -> Extensions)

## Running Nuxt
Edit the .env file to point to your API endpoint before starting nuxt.

- Install packages locally
```$ npm install```

- Run in development mode (hot reloading)
```$ npm run dev```

- Run for production
```$ npm run build && npm start```


# Static File Generation
Useful for deploying in serverless (github, netlify) or simple hosting environments / CDN





