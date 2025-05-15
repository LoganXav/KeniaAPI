FROM node:alpine

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

RUN pnpm add -g prisma

RUN apk add --no-cache openssl libssl3

COPY . .

RUN pnpm run prisma:stage-generate

RUN pnpm run build

EXPOSE 6500
EXPOSE 5500
EXPOSE 5555

CMD ["sh", "-c", "pnpm run prisma:stage-migrate && pnpm run start:stage"]
