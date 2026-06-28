# --- STAGE 1: Build the app ---
FROM node:alpine AS build

# Create app directory
WORKDIR /app

# Install dependencies
# (Copy just package.json/yarn.lock/pnpm-lock.json first for caching)
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm
RUN pnpm install

# Copy the rest of your source code
COPY . .

# Build the production-ready static files
RUN pnpm run build


# --- STAGE 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Copy the build output from the 'build' stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 5173
EXPOSE 5173

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]