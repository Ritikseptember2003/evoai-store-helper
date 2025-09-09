# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# SECURITY BEST PRACTICE: Update base image packages to patch vulnerabilities
RUN apk update && apk upgrade

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define the command to run your app
CMD [ "npm", "start" ]
