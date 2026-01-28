# Stage 1: The Builder (Keep this as is)
FROM node:18-alpine AS builder
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: The Asset Provider
FROM alpine:latest
WORKDIR /usr/share/nginx/html

# Copy the built files from the builder stage to this stage
COPY --from=builder /app/dist .

# When the container starts, it ensures the files are in the shared volume
# Then it just waits so the container doesn't restart constantly
CMD ["sh", "-c", "cp -r /usr/share/nginx/html/. /app_assets/ && sleep infinity"]