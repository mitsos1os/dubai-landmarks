# The build server dependencies image
FROM node:14 AS build-server
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci --only=production

# Build client dist
FROM node:14-slim AS build-client
WORKDIR /usr/src/app
# Install modules first
COPY client/package*.json /usr/src/app/client/
# install dependencies
RUN cd client && npm ci
# Copy client src files and build
COPY client /usr/src/app/client
COPY .env /usr/src/app/.env
# Build client
RUN cd client && npm run build -- --prod

# --------------> The production image
FROM node:14
ENV NODE_ENV production
RUN apt update && apt install dumb-init
RUN mkdir /usr/src/app
RUN chown node:node /usr/src/app
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build-server /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node index.js /usr/src/app/
COPY --chown=node:node cloud /usr/src/app/cloud
COPY --chown=node:node config /usr/src/app/config
COPY --chown=node:node --from=build-client /usr/src/app/client/dist /usr/src/app/client/dist
EXPOSE 1337
CMD ["dumb-init", "node", "index.js"]
