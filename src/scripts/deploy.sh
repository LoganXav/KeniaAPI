#!/bin/bash

# Exit on any failure
set -e

cd /home/ec2-user/apps/kenia/backend || exit 1

git clean -fd
git fetch --all
git reset --hard origin/HEAD

docker-compose down --volumes --remove-orphans

docker-compose up --build -d &  

sleep 50

if docker ps --filter "name=kenia_api" | grep -q "kenia_api"; then
  docker exec -it kenia_api pnpm run prisma:stage-migrate
else
  echo "Container kenia_api is not running. Exiting."
  exit 1
fi

echo "Deployment completed successfully!"
