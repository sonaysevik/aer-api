
-- Adminer 4.7.7 PostgreSQL dump

#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    
    CREATE DATABASE flightstest;
    \connect flightstest;
    CREATE USER flightstestuser WITH PASSWORD 'test-pass';


    CREATE SEQUENCE aircrafts_id_seq_test INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 6 CACHE 1;


    CREATE TABLE "public"."aircrafts" (
        "id" integer DEFAULT nextval('aircrafts_id_seq_test') NOT NULL,
        "registration_code" character varying(6) NOT NULL,
        "type" character varying(8) NOT NULL
    ) WITH (oids = false);

    INSERT INTO "aircrafts" ("id", "registration_code", "type") VALUES
    (1,	'ZS-GAO',	'A320-200'),
    (2,	'D-AIUO',	'A320-200'),
    (3,	'B-6636',	'A320-200'),
    (4,	'LY-BFM',	'B737-800'),
    (5,	'G-GDFW',	'B737-800'),
    (6,	'XA-AMZ',	'B737-800');

    CREATE SEQUENCE flights_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 3 CACHE 1;

    CREATE TABLE "public"."flights" (
        "id" integer DEFAULT nextval('flights_id_seq') NOT NULL,
        "flight_number" character varying(10) NOT NULL,
        "departure_airport" character(3) NOT NULL,
        "destination_airport" character(3) NOT NULL,
        "departure_timestamp" integer NOT NULL,
        "arrival_timestamp" integer NOT NULL,
        "registration_code" character varying(6) NOT NULL,
        "aircraft_id" integer NOT NULL
    ) WITH (oids = false);


    CREATE SEQUENCE portfolo_aircrafts_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 4 CACHE 1;

    CREATE TABLE "public"."portfolio_aircrafts" (
        "id" integer DEFAULT nextval('portfolo_aircrafts_id_seq') NOT NULL,
        "aircraft_id" integer NOT NULL,
        "portfolio_id" integer NOT NULL
    ) WITH (oids = false);


    CREATE SEQUENCE portfolios_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 12 CACHE 1;

    CREATE TABLE "public"."portfolios" (
        "id" integer DEFAULT nextval('portfolios_id_seq') NOT NULL,
        "name" character varying(150) NOT NULL
    ) WITH (oids = false);

    
    GRANT ALL PRIVILEGES ON DATABASE flightstest TO flightstestuser;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to flightstestuser;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public to flightstestuser;
    GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public to flightstestuser;
EOSQL
