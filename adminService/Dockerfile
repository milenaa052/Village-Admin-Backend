FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY docker-entrypoint.sh ./

RUN npm ci
RUN chmod +x docker-entrypoint.sh

COPY . .

RUN rm -rf dist && npm run build

RUN apk add --no-cache curl

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]