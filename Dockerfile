FROM oven/bun:latest AS install

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install


FROM imbios/bun-node:latest-20-debian

ARG DOMAIN_NAME

ENV CI=1
ENV EXPO_DEBUG=1

WORKDIR /app

COPY . ./
COPY --from=install /app/node_modules ./node_modules

EXPOSE 8081

ENTRYPOINT ["npx", "expo", "start", "--no-dev", "--minify"]
