# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm install --production

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "start" ]