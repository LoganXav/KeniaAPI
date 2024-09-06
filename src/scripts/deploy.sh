#!/bin/bash

# Exit on any failure
set -e

cd /home/ec2-user/apps/kenia/backend || exit 1

git clean -fd
git fetch --all
git reset --hard origin/HEAD

docker-compose down
docker-compose up --build -d &  

sleep 30

docker exec backend-kenia-api-1 pnpm run prisma:stage-migrate

echo "Deployment completed successfully!"
