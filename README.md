# Paper Trader

Paper trader allows you to practice trading stocks without spending any money. 
Currently, we only support the free yfinance API, but you can extend this project to support other APIs fairly easily.


## Setup and Installation (Non-Docker)

### Requirements

- Python >=3.9
- Node.js 
- pip
- npm

### Django Backend

After navigating to the `backend` folder,

1. install requirements: `pip install -r requirements.txt`
2. run `python manage.py makemigrations`
3. run `python manage.py migrate`
4. create an admin account: `python manage.py createsuperuser`
5. run the server: `python manage.py runserver`

### React Frontend 

After navigating to the `frontend` folder,

1. install packages: `npm install`
2. run `npm run dev`

## Setup and Installation (Docker)

### Requirements

- Docker

To install Docker, please refer to the docker getting started documentation.

### Instructions

Building the docker containers:

`docker build -f frontend.Dockerfile -t frontend-testing .`

`docker build -f backend.Dockerfile -t backend-testing .`

Running them detached:

`docker run -dp 127.0.0.1:3000:3000 frontend-testing`

`docker run -dp 127.0.0.1:8000:8000 backend-testing`


After you are finished trying things out, you can clean up your env.

Stopping all container processes:
`docker stop $(docker ps -a -q)`

Deleting all containers and volumes:
`docker rm -vf $(docker ps -aq)`

Deleting all docker images:
`docker rmi -f $(docker images -aq)`