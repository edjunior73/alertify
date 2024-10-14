FROM node:16.14.0-alpine AS build

RUN apk update && apk add g++ make python3

WORKDIR /var/app
ARG YARN_TIMEOUT=60000
ENV YARN_CACHE_FOLDER /var/app/.yarn
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --network-timeout $YARN_TIMEOUT
COPY . .
RUN yarn build
RUN npm prune --production --force


FROM node:16.14.0-alpine AS runtime
ENV TZ Etc/UTC
WORKDIR /home/node/app
USER node
EXPOSE 3000
COPY --chown=node:node --from=build /var/app/node_modules ./node_modules/
COPY --chown=node:node --from=build /var/app/dist ./dist
COPY package.json src ./

CMD [ "node", "dist/main.js" ]
