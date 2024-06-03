FROM python:3-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /simple/
COPY . .
RUN apt-get -y update
RUN apt-get install -y systemctl
RUN pip install -r requirements.txt
RUN python manage.py collectstatic
RUN python manage.py migrate
CMD gunicorn simple_votings.asgi:application
