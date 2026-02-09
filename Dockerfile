FROM node:25-alpine AS base

ARG ENVIRONMENT=development
ARG NEXT_PUBLIC_URL=http://localhost:8000
ARG NEXT_PUBLIC_API_URL=http://localhost:3001

ENV ENVIRONMENT=$ENVIRONMENT
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

FROM base AS builder
WORKDIR /srv/app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

FROM base AS runner
WORKDIR /srv/app
ENV NODE_ENV=production

COPY --from=builder /srv/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /srv/app/.next/standalone ./
COPY --from=builder --chown=node:node /srv/app/.next/static ./.next/static

RUN chown node:node .
USER node

CMD ["node", "server.js"]
