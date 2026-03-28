FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npx", "webpack", "serve", "--mode", "development", "--host", "0.0.0.0"]