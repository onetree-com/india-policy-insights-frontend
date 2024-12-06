FROM node:18-alpine

ARG REACT_APP_BASE_URL=http://localhost
ARG REACT_APP_WEBSITE_URL=https://indiapolicyinsights.org.in/enter-data-explorer
ARG REACT_APP_WEBSITE_HOME_URL=httpss://indiapolicyinsights.org.in/
ARG REACT_APP_MAP_SOURCE_URL=http://localhost/data

ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}
ENV REACT_APP_WEBSITE_URL=${REACT_APP_WEBSITE_URL}
ENV REACT_APP_WEBSITE_HOME_URL=${REACT_APP_WEBSITE_HOME_URL}
ENV REACT_APP_MAP_SOURCE_URL=${REACT_APP_MAP_SOURCE_URL}

WORKDIR /app

COPY package*.json ./
COPY *.config.js ./

RUN apk add --update python3 make g++ py3-setuptools && rm -rf /var/cache/apk/*

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]