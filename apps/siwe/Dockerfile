FROM node:21-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install -g  @nestjs/cli
RUN npm install  
COPY . .

RUN npm run build:siwe

CMD [ "npm", "run","start:siwe:prod" ]