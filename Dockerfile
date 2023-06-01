FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate dev --name init
RUN npx prisma generate

RUN npm run build

CMD ["node", "dist/main.js"]