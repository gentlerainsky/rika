FROM node:8.1

WORKDIR /app
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
RUN yarn

ADD . /app
CMD ["npm", "start"]
EXPOSE 3000
