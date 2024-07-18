# Kenia API Server

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Design Pattern/Architecture](#design-patternarchitecture)
4. [Folder Structure](#folder-structure)
5. [Tech Stack](#tech-stack)
6. [Setup Instructions](#setup-instructions)

---

## Introduction

### Project Overview

Kenia is an API server designed for managing various workflows within a school environment. It provides dynamic capabilities to encapsulate and manage school workflows using flexible templates.

### Code Architecture

The project is bootstrapped using components defined in the `infrastructure` folder. This includes the initialization of essential services like the database, logger, and the Express server.

- **Database**: The database configuration and connection setup are handled in the `infrastructure/database` module. Prisma is used as the ORM for interacting with the database.
- **Logger**: A centralized logging service is set up in the `infrastructure/logger` module to manage application-wide logging.
- **Express**: The Express server configuration, including middleware setup and route initialization, is handled in the `infrastructure/express` module.

The application logic is organized into modules under the `api/modules` folder. Each module encapsulates a specific domain of the application and follows the separation of concerns principle. By organizing the application into modules, we ensure that each module can operate independently and be maintained separately, promoting scalability, testability and maintainability

- **Controllers**: Each module has its controllers that define and manage API endpoints.
- **Services**: The services in each module contain the business logic and coordinate various operations.
- **Providers**: Providers are responsible for data access and interactions with the database, ensuring a clear separation between business logic and data access.

The project adheres to object-oriented programming principles and utilizes `tsyringe` for dependency injection to manage dependencies and promote modularity.

### Folder Structure

The project's folder structure is organized as follows:

```bash

kenia/
├── src/
│ ├── api/
│ │ ├── modules/
│ │ │ ├── auth/
│ │ │ │ ├── controllers/
│ │ │ │ ├── services/
│ │ │ │ └── providers/
│ │ │ │ └── ...
│ │ │ ├── staff/
│ │ │ │ ├── controllers/
│ │ │ │ ├── services/
│ │ │ │ └── providers/
│ │ │ │ └── ...
│ │ │ ├── status/
│ │ │ │ ├── controllers/
│ │ │ │ ├── services/
│ │ │ │ └── providers/
│ │ │ │ └── ...
│ │ │ └── ...
│ │ ├── shared/
│ │ │ ├── helpers/
│ │ │ ├── services/
│ │ │ └── providers/
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

### Tech Stack

Kenia is built using the following technologies and tools:

- **Express**
- **TypeScript**
- **Jest**
- **Prisma**
- **Tsyringe**

The project was bootstrapped with `pnpm` and includes a setup script (`pnpm run dev`) for development.

### Setup Instructions

To set up Kenia locally, follow these steps:
Set environment variables in .env file based on .env.example.

1. **Installation**:

   ```bash
   pnpm install
   pnpm run dev

   ```
