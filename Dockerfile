FROM node:12.10-alpine as build

COPY . /build

WORKDIR /build

RUN npm ci && npm run build \
    && mkdir /asemana && mkdir /asemana/storage \
    && cp -r /build/dist/client /asemana/public \
    && cp -r /build/dist/server /asemana/server \
    && mv .sequelizerc /asemana/ \
    && mv package.json /asemana/ \
    && mv package-lock.json /asemana/

FROM node:12.10-alpine

LABEL maintainer="syuchan1005<syuchan.dev@gmail.com>"
LABEL name="Asemana"

EXPOSE 80

ENV DEBUG="" NODE_ENV="production"

RUN apk add --no-cache supervisor=3.3.4-r1 nginx=1.14.2-r4 && mkdir /asemana

COPY --from=build ["/asemana/package.json", "/asemana/package-lock.json", "/asemana/"]

WORKDIR /asemana

RUN npm ci --only=production

COPY nginx.conf /etc/nginx/
COPY supervisord.conf /etc/

COPY --from=build /asemana /asemana

# "/asemana/production.sqlite" is file
VOLUME ["/asemana/storage"]

CMD npm run db:migrate -- --env production; /usr/bin/supervisord
