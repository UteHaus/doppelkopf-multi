FROM node:14.18-alpine3.13 as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install
COPY ./client .
RUN ng build --configuration production

FROM nginx:alpine 
COPY ./default.conf /etc/nginx/conf.d/default.conf 
COPY --from=build /app/dist /usr/share/nginx/html