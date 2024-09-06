# Stage 1: Build
FROM node:alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Stage 2: Production
FROM node:16-alpine
WORKDIR /usr/app

COPY --from=builder /app/node_modules ./
COPY . .

EXPOSE 5500

CMD ["pnpm", "run", "dev:stage"]
