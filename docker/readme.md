# 100x-dev Project

## Description
This project is a simple Node.js web application that connects to a MongoDB database. It responds with "Hello World" on the root route (/). The entire setup is containerized using Docker: the Node.js app and MongoDB each run in separate containers connected through a Docker network. This makes deployment and development easier and more portable.

---
### Dockerfile
Based on Node 20 image
Copies files and installs dependencies
Exposes port 3000
Steps to run app and MongoDB with Docker

## Build the Node.js app image:
docker build -t 100xtest .


## Create a Docker network to connect containers:
docker network create 100x-net


## Run MongoDB container on the network:
docker run -d --name mongo-container --network 100x-net -p 27017:27017  mongo


## Update your MongoDB connection string in the app:
mongodb://mongo-container:27017/your-database-name
This allows the app container to connect to MongoDB by its container name.

## Run the Node.js app container on the network:
docker run -d --name 100xexprescont --network 100x-net -p 3000:3000 100xtest

