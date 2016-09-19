FROM node:0.12

ADD . /usr/src/app

WORKDIR /usr/src/app

EXPOSE 8888

# start node
CMD ["node", "helloworld.js;"]
