FROM node:20-alpine

WORKDIR /app

# Install deps separately for better caching
COPY package.json package-lock.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 3000

# Default to dev for local testing; can be overridden to `npm run start`
CMD ["npm", "run", "dev"]

