FROM node:12.18.3-alpine3.9

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "node", "index.js" ]