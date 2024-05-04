# Install dependencies only when needed
FROM docker.io/node:lts as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /usr/src/app
COPY dist/apps/api/package*.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN pnpm install

# Production image, copy all the files and run nest
FROM docker.io/node:lts as runner


RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable dumb-init -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY dist/apps/api .

RUN chown -R node:node .
USER node
CMD ["dumb-init", "node", "main.mjs"]
