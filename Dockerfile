FROM node:20.15.0-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN pnpm install

COPY . .

EXPOSE 5000

CMD ["node", "dist/index.js"]