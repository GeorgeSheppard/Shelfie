# Shelfie Development Guide for Claude

This guide explains how to work with the Shelfie repository, including package management and API schema updates.

## Package Management with pnpm

This project uses **pnpm** as the package manager. Ensure you have pnpm installed before working on the project.

### Installing Dependencies

```bash
pnpm install
```

This installs all dependencies listed in `package.json`.

### Running Development Server

```bash
pnpm dev
```

Starts the Vite development server.

### Building for Production

```bash
pnpm build
```

Builds the application for production deployment.

## Validating Changes

Always validate your changes before committing:

### Linting

```bash
pnpm lint
```

Runs ESLint to check code style and quality.

## Deployment

The app is deployed using Cloudflare Pages. The `_redirects` file is configured to:
- Proxy all `/api/*` requests to `https://api.georgesheppard.dev/*`
- Serve the SPA properly by routing all requests to `index.html`

### Cloudflare Pages Configuration

When setting up the project on Cloudflare Pages:
- **Framework preset**: Vite
- **Build command**: `pnpm build`
- **Build output directory**: `dist`
- The `_redirects` file will be automatically copied to the dist folder during build

### Deploying with Wrangler CLI

Deploy scripts are already configured in package.json:

```bash
# Deploy to production
pnpm deploy

# Deploy to preview environment
pnpm deploy:preview

# Test locally with Cloudflare Pages environment
pnpm pages:dev
```

Or use wrangler commands directly:

```bash
# First time setup - create the project
pnpm wrangler pages project create shelfie

# Deploy to production
pnpm build
pnpm wrangler pages deploy dist --project-name=shelfie

# Deploy to preview
pnpm build
pnpm wrangler pages deploy dist --project-name=shelfie --branch=preview
```

The `pages:dev` script will serve the built files and respect the `_redirects` configuration, allowing you to test the Cloudflare Pages environment locally.

## API Integration

The frontend communicates with the backend API at `https://api.georgesheppard.dev` using auto-generated React Query hooks. The project uses [Orval](https://orval.dev/) to generate TypeScript types and hooks from the OpenAPI schema.

### API Client Architecture

- **Generated Hooks**: Located at `src/api/generated/hooks.ts`
- **HTTP Client**: Axios (configured in `src/lib/axios.ts`)
- **Base URL**: `/api` (proxied to api.georgesheppard.dev)
- **React Query**: All API calls use React Query hooks for caching and state management

### Updating the Backend Schema

When the backend API changes, follow these steps to update the frontend client:

#### Step 1: Fetch the Latest OpenAPI Schema

```bash
curl -o openapi.json https://raw.githubusercontent.com/GeorgeSheppard/api.georgesheppard.dev/master/generated/openapi/georgesheppard-spec.json
```

This downloads the latest schema from the GitHub repository and saves it to `openapi.json` in the project root.

#### Step 2: Generate API Client

```bash
pnpm generate:api
```

This runs Orval with the configuration in `orval.config.ts` and regenerates:
- TypeScript types for all API request/response models
- React Query hooks for all endpoints
- Location: `src/api/generated/hooks.ts`

#### Step 3: Test the Changes

After regenerating the API client, test your application:

```bash
pnpm dev  # Test locally
pnpm build  # Verify production build works
```

### Complete Schema Update Workflow

To update the backend schema and regenerate the API client in one command:

```bash
curl -o openapi.json https://raw.githubusercontent.com/GeorgeSheppard/api.georgesheppard.dev/master/generated/openapi/georgesheppard-spec.json && pnpm generate:api
```

## Configuration Files

- `vite.config.ts` - Vite configuration (includes plugin to copy _redirects to dist)
- `wrangler.toml` - Cloudflare Pages/Wrangler configuration
- `_redirects` - Cloudflare Pages redirect configuration for API proxying
- `orval.config.ts` - Orval configuration for API client generation
- `src/lib/axios.ts` - Axios instance configuration for API calls
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `openapi.json` - OpenAPI schema (source for code generation)
