FROM node:6.6

ADD . /usr/src/app

WORKDIR /usr/src/app

EXPOSE 8888

# start node
CMD ["node", "service.js"]
