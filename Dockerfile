FROM node:8.9-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies first (cache as docker layer)
COPY package.json yarn.lock .babelrc .env.example src ./
RUN yarn --pure-lockfile
RUN yarn compile

EXPOSE 3000
CMD [ "yarn", "start" ]
