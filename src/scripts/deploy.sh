#!/bin/bash

# Exit on any failure
set -e

cd /home/ec2-user/apps/kenia/backend || exit 1

git clean -fd
git fetch --all
git reset --hard origin/HEAD

docker-compose down --volumes --remove-orphans

docker-compose up --build -d &  

sleep 60

docker exec -i kenia_api pnpm run prisma:stage-migrate

echo "Deployment completed successfully!"


#  "prisma:stage-migrate": "dotenv -e .env.stage -- pnpm exec prisma migrate dev --name migration_$(date +%s)",
