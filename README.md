# Dubai Landmarks

## Overview
Example repo using Parse Community Server and Angular. The demo application will be a small showcase  of Dubai Landmarks

The frontend was created using as base an open source bootstrap theme _(ref1: CleanBlog)_

## Prerequisites
### Environment configuration
The application requires some environment configuration to be present in a form of `.env` file in the root directory. It is not included in the repo for security reasons, but you can see an example of such a file below:

```.dotenv
# Server settings
APP_ID=NqqPKd9Mzzdk0EfhsjfkiuyOXNb4tsqdq6Q8p0cZi
DB_URI=mongodb://localhost:27017/dubai-landmarks
MASTER_KEY=WEwN5oQVcXNff9hVgArtWqJUb8YtJIgFkE3dI4du
PUBLIC_SERVER_URL=http://localhost:1337/parse
SERVER_PROTOCOL=http
SERVER_HOST=localhost
SERVER_PORT=1337
PARSE_PREFIX=/parse
FILE_KEY=4be8-94b4-a8bc2177-8a21-3d51f7a7b2a5

# Photo settings
PHOTO_WIDTH=250
PHOTO_HEIGHT=250
MAX_PHOTO_SIZE=5000000

# Generic
APP_NAME=DubaiLandmarks
ADMIN_USER=admin
ADMIN_PASSWORD=admin

# Dashboard
PARSE_DASHBOARD_USER_ID=user1
PARSE_DASHBOARD_USER_PASSWORD=pass
```

### Database server
The application requires MongoDB instance to connect to for storing application data. If you have one running, then provide the appropriate connection URI as shown in the above **Environment configuration** section

If you just need to run one for tests and you have `docker` installed you can run the following command:
`docker run -p 27017:27017 mongo` which will spin up a mongodb server with its default 27017 exposed on the localhost interface

## Steps to locally install and run the project
1. Clone the project using `git clone https://github.com/mitsos1os/dubai-landmarks.git`
2. Make sure you have **Node V14-latest** available. If you don't you can install it using `nvm` or a method of your choice. 
3. Make sure that you **provide a `.env` file in local root directory!** _(It is also required at build time for client to get built with proper environment information)_
4. Run `npm install-build` which will install all necessary client-server dependencies and build frontend client
5. RUN `npm start` and server will start on configured port where you can visit and test in your browser _(default `http://localhost:1337`)_

## Docker build
Due to Parse Client backend being dynamically configured, in all docker builds you have to be careful to set the proper `PUBLIC_SERVER_URL` environment variable, which will define where the Parse client will client. For a simple build running locally for docker, this would have to be set up as the Docker Containers IP. ex: `172.17.0.2` _(if it is the first container running in a docker network with ip `172.17.0.0`)_
### Dockerfile
A `Dockerfile` is also provided which can be used to create a docker image of the provided repo. In order to build the image you have to run a simple `docker build -t <DESIRED_TAG_NAME> .` in the root directory of the repo.

In order to successfully run the Docker Image created don't forget that you need to provide either the environment configuration or a `.env` file mounted in `/usr/src/app` folder in the docker container which will require all the necessary information
ex: `docker run -v <PATH_TO_.ENV_FILE>:/usr/src/app/.env <GIVEN_TAG_NAME>`

### Docker compose
For even simpler **all-inclusive** installation using **Docker Compose** you can use the included `docker-compose.yml` file which can be directly run by issuing `docker-compose up` in the root directory of the project.

The configuration through `.env` file is also required here. For convenience _(since container ip cannot be known before running the actual container)_, the docker compose publishes default port 1337 of web app to localhost, so that it can be used in .env file as configuration that will be given to the app.

Taking that into account the `.env` file should contain the following configuration:
```dotenv
# inner db name in compose network
DB_URI=mongodb://db:27017/dubai-landmarks
# we have publised the server port to localhost in order for the browser to know where to send requests
PUBLIC_SERVER_URL=http://localhost:1337/parse  
```

### References
_ref1_: [StartBootstrap clean blog theme](https://github.com/startbootstrap/startbootstrap-clean-blog)
