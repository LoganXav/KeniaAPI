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

Kenia follows a modular, monolithic, layered architecture, emphasizing separation of concerns:

- **Controllers:** Define and manage API endpoints.
- **Services:** Implement business logic and workflow orchestration.
- **Providers:** Handle database interactions.

The project adheres to object-oriented programming principles and utilizes `tsyringe` for dependency injection.

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
│ │ │ ├── controllers/
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
