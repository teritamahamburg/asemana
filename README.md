# あせまな - Asemana

[![Docker Hub Version](https://img.shields.io/badge/dynamic/json?logo=docker&style=for-the-badge&label=Docker%20Hub&query=results.0.name&url=https%3A%2F%2Fregistry.hub.docker.com%2Fv2%2Frepositories%2Fsyuchan1005%2Fasemana%2Ftags%2F)](https://hub.docker.com/r/syuchan1005/asemana)

[![dockeri.co](https://dockeri.co/image/syuchan1005/asemana)](https://hub.docker.com/r/syuchan1005/asemana)

## Docker
```bash
$ docker run \
    -p 80 \
    -v /{Your path}/storage:/asemana/storage \
    -v /{Your path}/production.sqlite:/asemana/production.sqlite \
    syuchan1005/asemana:${version}
```

## Development
```bash
$ npm install
$ npm run client:serve
$ npm run server:serve
```
