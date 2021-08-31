FROM node:16.7
WORKDIR /app
COPY yarn.lock package.json ./
COPY ./src  ./src
RUN yarn
CMD ["yarn", "run", "dev"]
