# FROM node:14-slim
FROM node:16
WORKDIR /usr/src/app
#Install packages
COPY package*.json ./
RUN npm install
#Set node to production
ENV NODE_ENV=production
#Copy files over
COPY . .
#Build it
RUN npm run build
#Serve it
CMD [ "npm", "start" ]