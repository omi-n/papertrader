FROM node:22-alpine3.18

WORKDIR /app

COPY . /app/

WORKDIR /app/frontend

RUN npm install

RUN npm run build

CMD ["npx", "vite", "serve", "--host", "--port", "3000"]

EXPOSE 3000