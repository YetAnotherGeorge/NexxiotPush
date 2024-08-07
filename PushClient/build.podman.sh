#!/bin/bash
set -e;
podman build -f Containerfile -t localhost/push-client .;
podman-compose up -d --force-recreate \
   && podman container logs --follow nexxiot-push-node
