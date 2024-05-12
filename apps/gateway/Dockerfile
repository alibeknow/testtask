FROM node:21-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install -g  @nestjs/cli
RUN npm install  
COPY . .

RUN npm run build:gateway

EXPOSE 8880

CMD [ "npm", "run","start:gateway:prod" ]