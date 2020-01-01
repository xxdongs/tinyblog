FROM node:10-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache git bash \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org \
    && cnpm install -g eslint

EXPOSE 3000