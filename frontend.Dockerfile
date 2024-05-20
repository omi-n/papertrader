FROM node:22-alpine3.18

WORKDIR /app

COPY frontend/package.json /app/

RUN npm install

COPY . /app/

WORKDIR /app/frontend

RUN npm run build

CMD ["npx", "vite", "serve", "--host", "--port", "3000"]

EXPOSE 3000