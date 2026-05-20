FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN rm -rf dist && npm run build
RUN apk add --no-cache curl

EXPOSE 3000
CMD ["npm", "start"]