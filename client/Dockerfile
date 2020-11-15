FROM node:14.2.0-alpine3.11 as build
WORKDIR /app

RUN npm install -g @angular/cli
 
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
COPY . .
RUN ng build --prod

FROM nginx as runtime
COPY --from=build /app/dist /usr/share/nginx/html