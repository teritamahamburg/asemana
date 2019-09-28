# あせまな - Asemana

[![shields.io](https://img.shields.io/badge/latest-v1.4.0-brightgreen?style=for-the-badge)](https://hub.docker.com/r/syuchan1005/asemana)

[![dockeri.co](https://dockeri.co/image/syuchan1005/asemana)](https://hub.docker.com/r/syuchan1005/asemana)

## Docker
```bash
$ docker run \
    -p 80 \
    -v /{Your path}/storage:/asemana/storage \
    -v /{Your path}/production.sqlite:/asemana/production.sqlite \
    syuchan1005/asemana:1.3.9
```

## Development
```bash
$ npm install
$ npm run client:serve
$ npm run server:serve
```
