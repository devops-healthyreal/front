# ============================================
# Stage 1: Build Vue Application
# ============================================
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY src/@iconify ./src/@iconify
# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build Vue application for production
RUN npm run build

# ============================================
# Stage 2: Production Nginx Server
# ============================================
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 7001 (internal container port)
EXPOSE 7001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:7001/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

