FROM node:8-alpine

# Create app directory
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

# Copy required project files
COPY package.json yarn.lock .babelrc .env.example ./
COPY src/ ./src/

# Install app dependencies first (cache as docker layer)
RUN yarn --frozen-lockfile
RUN yarn compile

EXPOSE 3000
CMD [ "yarn", "start" ]
