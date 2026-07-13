FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]# backend/Dockerfile

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]