## Itenary

**_(Features)_**

- Staff Creation - In Progress
- Student Admission
- Course Upload and Delivery

**_(Documentation and Tests)_**

- Update documentation wuth relevant updates
- Write unit tests for all auth services

## Bug Fixes

- Server time is one hour behind
- Refactor reset password to use token instead of link

## Deployment

- Write CI/CD scripts to automate testing

## Server Management

- Persist postgres data volumes inside docker container

## Future Considerations

- Consider using a message queuing system for the email service.
- Implement service trace db persistence.

- Put permissions handler in the handler for controllers

## Docker Implementation for Redis

- Setup Docker for the project including redis. However for now if using docker to run redis locally. To run: `docker run --name redis -d -p 6379:6379 redis`. To connect: `docker exec -it redis redis-cli`



