FROM node:lts-alpine

# Install build tools (python, et al) for node-gyp.
RUN apk add --quiet --no-cache python make gcc libc-dev g++ 

WORKDIR /server

COPY package.json ./

RUN npm install
RUN apk del --quiet python make gcc libc-dev g++

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE 4200
CMD [ "npm", "run", "start" ]
