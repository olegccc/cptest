# CPTEST Monorepo

Vite-based yarn monorepo with TypeScript.

## Packages

- **frontend**: React app with Zustand state management
- **backend**: Express server with Vite middleware serving frontend and API routes
- **shared**: Shared TypeScript types and utilities

## Setup

```bash
yarn install
```

## Development

**Note:** Build the project first:

```bash
yarn build
```

Shared package is not built with hot reload, so you need to rebuild it manually after changes in the shared package:

```bash
yarn build:shared
```

### Full stack (recommended)

The backend server serves the frontend with hot reload:

```bash
yarn dev
```

Server runs at http://localhost:3000

### Frontend only

Run the frontend standalone:

```bash
cd packages/frontend && yarn dev
```

Frontend runs at http://localhost:3001

## Build

```bash
yarn build
```

## Testing

Run all tests:

```bash
yarn test
```

Run tests for specific package:

```bash
yarn test:frontend
yarn test:backend
```

## Linting

Check for linting issues:

```bash
yarn lint
```

Fix linting issues automatically:

```bash
yarn lint:fix
```

## Formatting

Format code with Prettier:

```bash
yarn format
```

Check formatting without changes:

```bash
yarn format:check
```
