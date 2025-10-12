# ============================================
# Stage 1: Build Vue Application
# ============================================
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY yarn.lock* ./

# Copy @iconify BEFORE npm install (required for postinstall script)
COPY src/@iconify ./src/@iconify

# Install all dependencies (including devDependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build Vue application for production
RUN npm run build

# ============================================
# Stage 2: Production Nginx Server
# ============================================
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expose port 7001 (configured in nginx.conf)
EXPOSE 7001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:7001/health || exit 1


# Start nginx
CMD ["nginx", "-g", "daemon off;"]

