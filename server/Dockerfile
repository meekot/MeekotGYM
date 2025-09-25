# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* tsconfig.json ./
COPY src ./src

RUN npm install --production=false
RUN npm run build
RUN npm prune --omit=dev

EXPOSE 3333

CMD ["node", "dist/index.js"]
