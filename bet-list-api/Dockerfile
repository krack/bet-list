FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
    
ADD package.json /tmp/package.json
ADD README.md /tmp/README.md
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 8080
CMD ["node", "index.js"]
