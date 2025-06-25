FROM node:20 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

#config for react dev
#expose 3000
#
#CMD ["npm", "run", "dev"]
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
#nginx config
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
#

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

