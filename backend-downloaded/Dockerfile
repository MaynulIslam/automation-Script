# Use a minimal base image
FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Set environment variable for npm authentication token
ARG NPM_TOKEN

# Configure npm to use the GitHub npm registry
RUN echo "@maestrodigitalmine:registry=https://npm.pkg.github.com/" > .npmrc
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc

# Copy only package.json and package-lock.json
COPY package*.json ./


RUN mkdir -p /opt/duettodata && chmod -R 777 /opt/duettodata

# Install app dependencies
RUN npm install

# Remove .npmrc file after dependencies are installed (for security)
RUN rm -f .npmrc

# Copy the rest of the application
COPY . .

# Expose the necessary port
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]
