# aerlytix

To deploy the application refer to "docker-compose.yaml" file. Following command will deploy database and API project.
    `docker-compose up -d --build`

API project needs following environment variables:
    - NODE_ENV: Application runtime 
    - DB_HOST: DB host name. 
    - DB_NAME: Database name to connect
    - DB_USERNAME: DB Username
    - DB_PASSWORD: DB_USERNAME's password

NOTE: IT might take up to a minute for Postgres container to fully get up and running. 


