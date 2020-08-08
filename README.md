# Aerlytix Fligths API

#Environment Variables

API project needs following environment variables:

    - NODE_ENV: Application runtime 
    - DB_HOST: DB host name. 
    - DB_NAME: Database name to connect
    - DB_USERNAME: DB Username
    - DB_PASSWORD: DB_USERNAME's password


# To run application locally 

    - Run `docker-compose up -d --build` to get database up and running
    - Run `npm install`
    - Run `node index.js` 
    - If no environment variable is provided default values for env variables are in utils/config/config.js file. 


# To deploy the application

Refer to "docker-compose.yaml" file. Following command will deploy database and API project.
    `docker-compose up -d --build`


NOTE: IT might take up to a minute for Postgres container to fully get up and running. 


# To run the tests trigger: `npm run test`