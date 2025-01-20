# Kenia API Server

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Code Architecture](#design-patternarchitecture)
4. [Folder Structure](#folder-structure)
5. [Tech Stack](#tech-stack)
6. [Setup Instructions](#setup-instructions)
7. [Testing](#testing)
8. [Tooling](#tooling)
9. [Documentation](#documentation)

## Introduction

## Project Overview

<details>

<summary>[-]</summary>

Kenia is an API server designed for managing various workflows within a school environment. It provides dynamic capabilities to encapsulate and manage school workflows using flexible templates.

</details>

## Code Architecture

<details>

<summary>[-]</summary>

The project is bootstrapped using components defined in the `infrastructure` folder. This includes the initialization of essential services like the database, logger, middlewares, swagger doc, and the sxpress server.

- **Database**: The database configuration and connection setup are handled in the `infrastructure/internal/database` module. Prisma is used as the ORM for interacting with the database.
- **Logger**: A centralized logging service is set up in the `infrastructure/internal/logger` module to manage application-wide logging.
- **Express**: The express server configuration, including middleware setup and route initialization, is handled in the `infrastructure/internal/express` module.

The application logic is organized into modules under the `api/modules` folder. Each module encapsulates a specific domain of the application and follows the separation of concerns principle. By organizing the application into modules, we ensure that each module can operate independently and be maintained separately, promoting scalability, testability and maintainability

- **Controllers**: Each module has its controllers that define and manage API endpoints.
- **Services**: The services in each module contain the business logic and coordinate various operations.
- **Providers**: Providers are responsible for data access and interactions with the database, ensuring a clear separation between business logic and data access.

The project adheres to object-oriented programming principles and utilizes `tsyringe` for dependency injection to manage dependencies and promote modularity.

</details>

## Folder Structure

<details>

<summary>[-]</summary>

The project's folder structure is organized as follows:

```bash

kenia/
├── src/
│ ├── api/
│ │ ├── modules/
│ │ │ ├── auth/
│ │ │ │ ├── controllers/
│ │ │ │ ├── e2e/
│ │ │ │ ├── services/
│ │ │ │ │ ├── __tests__/
│ │ │ │ └── providers/
│ │ │ │ └── ...
│ │ │ ├── staff/
│ │ │ │ ├── controllers/
│ │ │ │ ├── e2e/
│ │ │ │ ├── services/
│ │ │ │ │ ├── __tests__/
│ │ │ │ └── providers/
│ │ │ │ └── ...
│ │ │ ├── base/
│ │ │ │ ├── controllers/
│ │ │ │ ├── services/
│ │ │ │ └── ...
│ │ │ └── ...
│ │ ├── shared/
│ │ │ ├── helpers/
│ │ │ ├── services/
│ │ │ └── types/
│ │ │ └── ...
│ ├── config/
│ ├── infrastructure/
│ │ │ ├── external/
│ │ │ └── internal/
│ │ │ │ ├── application/
│ │ │ │ ├── database/
│ │ │ │ └── middlewares/
│ │ │ │ └── ...
│ ├── types/
│ ├── utils/
│ └── index.ts
├── .env.example
└── README.md

```

</details>

## Tech Stack

<details>

<summary>[-]</summary>

Kenia is built using the following technologies and tools:

- **Express**
- **TypeScript**
- **Jest**
- **Prisma**
- **Tsyringe**
- **Docker**

The project was bootstrapped with `pnpm` and includes a setup script (`pnpm run dev`) for development.

</details>

## Setup Instructions

<details>
<summary>[-]</summary>

To set up Kenia locally, follow these steps:

- Ensure you have docker installed.
- Set environment variables in .env.dev file based on .env.example.

1. **Clone the repository**:

   ```bash
   git clone https://github.com/LoganXav/KeniaAPI.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd KeniaAPI
   ```

3. **Run Docker to start the application**:

   ```bash
   docker-compose up -d
   ```

4. **Generate Prisma client**:

   ```bash
   pnpm run prisma:generate
   ```

5. **Run migrations**:

   ```bash
   pnpm run prisma:migrate
   ```

</details>

## Testing

<details>
<summary>[-]</summary>

### Unit Tests

- **Tool**: Jest
- **Location**: `api/modules/[module]/services/__tests__/`
- **Description**: Unit tests are written to verify the functionality of individual services. Each service has corresponding tests to ensure that the business logic works as expected.

### End-to-End (E2E) Tests

- **Tool**: Jest, Supertest
- **Location**: `api/modules/[module]/e2e/`
- **Description**: E2E tests are used to test the entire application flow, from controllers handling HTTP requests to the database access layer returned by providers. These tests ensure that the API endpoints work correctly with the Prisma ORM.

### Database for E2E Tests

- **Configuration**: A local Postgres database running in a Docker container is used for E2E tests. The Docker container is defined in `docker-compose.yml`.

- **Test**: Runs all tests

  ```bash
  pnpm run test
  ```

- **Test Coverage**: Runs tests with coverage reporting

  ```bash
  pnpm run test:coverage
  ```

- **Test Watch**: Runs tests in watch mode

  ```bash
  pnpm run test:watch
  ```

<!-- - **E2E Test**: Runs end-to-end tests -->

  <!-- ```bash -->
  <!-- pnpm test:e2e -->
  <!-- ``` -->

</details>

## Tooling

<details>
<summary>[-]</summary>

To maintain code quality and consistency, Kenia utilizes the following tooling:

- **Husky**: The project uses Husky to manage Git hooks, ensuring that linters and tests run automatically before any code is committed or pushed.

- **ESLint**: ESLint is our go-to tool for linting JavaScript and TypeScript. We've configured it with a set of rules tailored to our coding style and best practices,

- **Prettier**: Using prettier ensures that all code adheres to a consistent style, making it easier to read and maintain. It automatically formats code on commit using Husky's pre-commit hooks.

- **Commit Lint**: We enforce a strict commit message format as defined in `/commitlint.config.mjs` using a linter setup via Husky's commit-msg hook.
  e.g

  ```bash
  Feat: add new user login feature
  Fix: resolve issue with user permissions
  ```

</details>

## Documentation

<details>
<summary>[-]</summary>

The project uses `swagger-ui-express` for API documentation. Swagger documentation is dynamically generated when routes are registered.

**Endpoint for Swagger UI**: `/docs`

</details>
