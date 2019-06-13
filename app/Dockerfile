FROM node:lts-alpine

RUN npm install --silent --global @vue/cli-service http-server

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE 8080
CMD [ "http-server", "dist" ]
