#!/bin/bash
set -e;
docker build -f Containerfile -t localhost/push-client .;
docker compose up -d --force-recreate \
   && docker container logs --follow nexxiot-push-node
