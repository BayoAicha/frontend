# frontend/Dockerfile

# Étape 1 : build React
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : servir le build avec NGINX
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Expose le port HTTP
EXPOSE 80

# NGINX démarre automatiquement
