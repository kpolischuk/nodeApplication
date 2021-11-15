FROM node:16-alpine

WORKDIR /app

RUN \
apk --no-cache upgrade && \
apk --no-cache add tzdata && \
cp /usr/share/zoneinfo/Europe/Kiev /etc/localtime && \
echo "Europe/Kiev" > /etc/timezone

RUN \
npm i -g modclean;

COPY .npmrc ./
COPY package*.json ./

RUN npm ci

RUN \
modclean -r && npm uninstall modclean;

COPY . .

