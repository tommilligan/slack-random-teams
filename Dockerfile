FROM node:9.5

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies first (cache as docker layer)
COPY package.json yarn.lock .env.example ./
RUN yarn --production --pure-lockfile

# Copy build app files
COPY ./dist ./dist

EXPOSE 3000
CMD [ "yarn", "start" ]
