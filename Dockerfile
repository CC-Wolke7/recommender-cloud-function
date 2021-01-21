# --- Build container ---
# Includes build tools required for native dependencies
FROM node:14.15.4 as builder

WORKDIR /app

# Dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . ./
RUN npm run build

# --- Run container ---
FROM node:14.15.4-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
