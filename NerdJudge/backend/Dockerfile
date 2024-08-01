# Use the official Node.js image.
FROM node:18-alpine

# Install build tools and compilers for different languages.
RUN apk update && apk add --no-cache \
    gcc \
    g++ \
    openjdk11-jdk \
    python3 \
    python3-dev \
    py3-pip \
    bash \
    make \
    cmake \
    && rm -rf /var/cache/apk/*

# Set the working directory.
WORKDIR /app

# Install app dependencies.
COPY package*.json ./
RUN npm install

# Copy the app files.
COPY . .

# Expose the port the app runs on.
EXPOSE 8000

# Start the app.
CMD ["npm", "start"]
