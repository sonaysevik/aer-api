FROM postgres:9.6.18

COPY ./init_db.sql  /docker-entrypoint-initdb.d

COPY ./init_db_test.sh  /docker-entrypoint-initdb.d