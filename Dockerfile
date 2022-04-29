FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY .npmrc package.json package-lock.json ./
ARG GITHUB_NPM_TOKEN
ENV GITHUB_NPM_TOKEN $GITHUB_NPM_TOKEN
RUN npm install --verbose

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps ./app/node_modules ./node_modules
COPY . ./
RUN npm run build

FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1017 nodejs
RUN adduser --system --uid 1017 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]

