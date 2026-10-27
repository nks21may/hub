# El sitio en dos etapas, como nonograma: node corre el gate entero (tipos, lint, tests y build) y la
# imagen final es un nginx con dist/ y su conf, nada más. Si el gate falla, el build de la imagen
# falla y no se publica nada.
#
# El catálogo no entra acá (ADR-0004): lo monta el compose de infra en /usr/share/nginx/catalogo.
# Qué corre en la VPS, y cómo, se decide en el repo infra.

FROM node:24-alpine AS build
WORKDIR /src

# Primero sólo el lockfile: mientras no cambien las dependencias, la capa del npm ci sale de la
# cache.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run gate

# nginx-unprivileged y no el oficial: corre sin root y escucha en 8080, así que el contenedor no
# necesita root ni capabilities. El compose de infra lo monta read-only encima de eso.
FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY --from=build --chown=root:root /src/dist /usr/share/nginx/html
COPY --chown=root:root deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
