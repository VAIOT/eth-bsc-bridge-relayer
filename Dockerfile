FROM node:15.11.0-alpine3.10

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i --production && npm prune --production

COPY . .

CMD node index.js
