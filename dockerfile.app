FROM node:22.21.1-alpine

WORKDIR /app

ENV NODE_ENV=development

# Copy package files (package-lock.json is optional)
COPY package.json package-lock.json* ./

# Install dependencies
# Use npm ci if package-lock.json exists, otherwise npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Copy application files
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]