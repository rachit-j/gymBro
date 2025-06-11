# ─── 1. Builder Stage ─────────────────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM node:18-bullseye AS builder

WORKDIR /app

# Install system dependencies for Prisma engine compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gcc \
    g++ \
    libssl-dev \
  && rm -rf /var/lib/apt/lists/*

# Install Rust (required to compile the Prisma query engine)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy package definition and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Generate the Prisma client (compiles the native engine)
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# ─── 2. Runner Stage ──────────────────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM node:18-bullseye-slim AS runner

WORKDIR /app

# Copy production dependencies and built artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma        ./prisma
COPY --from=builder /app/.next         ./.next
COPY --from=builder /app/public        ./public
COPY --from=builder /app/package.json  ./package.json

# Set production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# On container start, ensure SQLite database is created/migrated, then start the app
CMD ["sh", "-c", "npx prisma db push && npm run start"]
