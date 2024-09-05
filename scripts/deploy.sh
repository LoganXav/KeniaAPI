#!/bin/bash

# Exit on any failure
set -e

cd /home/ec2-user/apps/kenia/backend || exit 1

git pull origin master

docker-compose down
docker-compose up --build -d

docker exec -it backend-kenia-api-1 pnpm run prisma:stage-generate
docker exec -it backend-kenia-api-1 pnpm run prisma:stage-migrate

echo "Deployment completed successfully!"
