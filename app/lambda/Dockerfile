# syntax=docker/dockerfile:1
FROM node:20

WORKDIR /var/task

COPY package.json package-lock.json* ./

RUN npm install --arch=x64 --platform=linux

COPY . .

CMD ["bash"]