#!/bin/bash
VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi
echo "Building version $VERSION"

set -e;
podman build -f Containerfile --build-arg VERSION="$VERSION" -t localhost/push-client .;
podman-compose up -d --force-recreate \
   && podman container logs --follow nexxiot-push-node