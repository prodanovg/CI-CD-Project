## Dockerfile.dev
#
#FROM node:20
#
#WORKDIR /app
#
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#
#ENV LOCAL=true
#ENV VITE_BACKEND_URL=/api
#
#EXPOSE 3000
#
#CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

ENV LOCAL=true
ENV VITE_BACKEND_URL=/api

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
