# Use Node.js LTS version as base image
FROM node:lts AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Build the Vue.js application
RUN yarn build

# Use Nginx as base image for serving static content
FROM nginx:alpine

# Copy built Vue.js files to Nginx web server directory
COPY --from=build /app/dist /usr/share/nginx/html


# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf


# Expose port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
