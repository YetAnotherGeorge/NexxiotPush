#!/bin/bash
VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi
echo "Building version $VERSION"

set -e;
docker build -f Containerfile --build-arg VERSION="$VERSION" -t localhost/push-client .;
docker compose up -d --force-recreate \
   && docker container logs --follow nexxiot-push-node
