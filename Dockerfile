FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm install; \
  fi

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  elif [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --prod --frozen-lockfile; \
  else npm install --omit=dev; \
  fi

COPY --from=builder /usr/src/app/dist ./dist
COPY config ./config
COPY uploads ./uploads

EXPOSE 3000

CMD ["node", "dist/main.js"]

