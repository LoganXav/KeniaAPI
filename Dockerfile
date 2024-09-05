FROM node:lts

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY ./ ./

RUN pnpm run prisma:stage-generate

EXPOSE 5500

CMD ["pnpm", "run", "dev"]