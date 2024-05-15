# Install dependencies only when needed
FROM docker.io/node:lts-alpine as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY dist/apps/manage-bot/package*.json ./
COPY dist/apps/manage-bot/*lock.yaml ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN corepack enable
RUN corepack prepare pnpm@8.10.5 --activate
RUN pnpm install --frozen-lockfile

# Production image, copy all the files and run nest
FROM docker.io/node:lts-alpine as runner

RUN apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY dist/apps/api .

RUN chown -R node:node .
USER node
CMD ["dumb-init", "node", "main.mjs"]
