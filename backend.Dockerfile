FROM ubuntu:20.04

# install tmux
RUN apt-get update && apt-get install -y tmux

# setup backend
WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip

COPY backend/requirements.txt /app/

RUN pip3 install -r requirements.txt

COPY . /app/

WORKDIR /app/backend

RUN python3 manage.py makemigrations

RUN python3 manage.py migrate

RUN tmux new-session -d -s "backend" "python3 manage.py runserver"

RUN python3 populate_tickers.py --max_stocks 100

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000/tcp