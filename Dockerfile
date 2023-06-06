FROM node:16-alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine

COPY --from=builder /app/node_modules ./app/node_modules
COPY --from=builder /app/package*.json ./app/
COPY --from=builder /app/dist ./app/dist

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
