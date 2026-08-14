# Stage 1: Build Vite Frontend
FROM node:22-alpine AS client-builder
WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm install

# Copy frontend source files and build
COPY client/ ./
RUN npm run build

# Stage 2: Express Production Server
FROM node:22-alpine AS runner
WORKDIR /app/server

# Install backend production dependencies
COPY server/package*.json ./
RUN npm install --omit=dev

# Copy backend source code
COPY server/ ./

# Copy compiled frontend from client-builder into server/public
COPY --from=client-builder /app/client/dist ./public

# Set production environment and port
ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

# Start Express server
CMD ["node", "index.js"]
