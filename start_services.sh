# /bin/sh

sudo docker-compose -f infrastructure.yml up -d && sudo docker-compose -f service.yml up --build -d