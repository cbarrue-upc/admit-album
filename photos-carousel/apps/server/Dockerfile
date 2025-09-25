FROM node:20-alpine as builder
WORKDIR /app
COPY ../../package.json ../../pnpm-workspace.yaml ../../tsconfig.base.json ../../tsconfig.json ./
COPY ../../packages ./packages
COPY . ./apps/server
RUN npm install -g pnpm@8.15.4
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @photos-carousel/server build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/apps/server/node_modules ./node_modules
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
