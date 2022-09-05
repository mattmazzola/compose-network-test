FROM node:18-alpine as base

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

FROM base as deps

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "start" ]