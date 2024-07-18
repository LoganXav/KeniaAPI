# Kenia API Server for School Management System

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview-1)
3. [Design Pattern/Architecture](#design-patternarchitecture-1)
4. [Folder Structure](#folder-structure-1)
5. [Tech Stack](#tech-stack-1)
6. [Setup Instructions](#setup-instructions-1)
7. [Contributing](#contributing)
8. [Testing](#testing)
9. [License](#license)

---

## Introduction

Kenia is an API server designed for managing various workflows within a school environment. It provides dynamic capabilities to encapsulate and manage school workflows using flexible templates.

### Project Overview

Kenia is an API server designed for managing various workflows within a school environment. It provides dynamic capabilities to encapsulate and manage school workflows using flexible templates.

### Design Pattern/Architecture

Kenia follows a monolithic layered architecture, emphasizing separation of concerns:

- **Controllers:** Define and manage API endpoints.
- **Services:** Implement business logic and workflow orchestration.
- **Providers:** Handle database interactions.

The project adheres to object-oriented programming principles and utilizes `tsyringe` for dependency injection.

### Folder Structure

The project's folder structure is organized as follows:

kenia/
│
├── src/
│ ├── api/
│ │ ├── modules/
│ │ │ ├── auth/
│ │ │ ├── status/
│ │ │ └── staff/
│ │ │ └── ...
│ │ │ │ ├── controllers/
│ │ │ │ ├── services/
│ │ │ │ └── providers/
│ │ │ │ └── ...
│ │ ├── shared/
│ │ │ ├── controllers/
│ │ │ ├── services/
│ │ │ └── providers/
│ ├── config/
│ ├── infrastructure/
│ ├── types/
│ ├── utils/
│ └── index.ts
├── .env.example/
└── README.md

### Tech Stack

Kenia is built using the following technologies and tools:

- **Express**: Web framework for Node.js
- **TypeScript**: Typed superset of JavaScript
- **Jest**: Testing framework
- **Prisma**: Database toolkit
- **tsyringe**: Dependency injection library

The project was bootstrapped with `pnpm` and includes a setup script (`pnpm run dev`) for development.

### Setup Instructions

To set up Kenia locally, follow these steps:
Set environment variables in .env file based on .env.example.

1. **Prerequisites**:

   - Node.js installed (version X.X.X)
   - PostgreSQL database

2. **Installation**:

   ```bash
   pnpm install
   pnpm run dev

   ```
