FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Install TypeScript globally
RUN npm install -g typescript

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Setup database
RUN npm run setup || true

# Expose port
EXPOSE 8081

# Start the application
CMD ["npm", "run", "start:prod"]
