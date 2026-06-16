# syntax=docker/dockerfile:1
# Static-site container — serves the catalog with nginx on port 80.
FROM nginx:1.27-alpine

COPY . /usr/share/nginx/html

EXPOSE 80
