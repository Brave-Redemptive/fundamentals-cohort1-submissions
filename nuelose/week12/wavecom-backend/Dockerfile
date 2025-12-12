FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apk add --no-cache bash curl \
    && curl -L https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh -o /usr/local/bin/wait-for-it \
    && chmod +x /usr/local/bin/wait-for-it

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "wait-for-it rabbitmq:5672 --timeout=60 --strict -- npm run dev"]