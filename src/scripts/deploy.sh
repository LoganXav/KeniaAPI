#!/bin/bash

# Exit on any failure
set -e

cd /home/ec2-user/apps/kenia/backend || exit 1

# Discard any untracked files and directories
git clean -fd

# Reset local changes and forcefully pull the latest code from master
git fetch --all
git reset --hard origin/master

docker-compose down

docker-compose up --build -d

# docker exec backend-kenia-api-1 pnpm run prisma:stage-generate
docker exec backend-kenia-api-1 pnpm run prisma:stage-migrate

echo "Deployment completed successfully!"
