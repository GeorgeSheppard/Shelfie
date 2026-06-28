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

The app is deployed using Cloudflare Pages. The `wrangler.jsonc` configuration:
- Sets up SPA routing (all routes serve `index.html`)
- API calls go directly to `https://api.georgesheppard.dev` (no proxy needed)

### Cloudflare Pages Configuration

When setting up the project on Cloudflare Pages:
- **Framework preset**: Vite
- **Build command**: `pnpm build`
- **Build output directory**: `dist`

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

The `pages:dev` script will serve the built files with SPA routing, allowing you to test the Cloudflare Pages environment locally.

## API Integration

The frontend communicates with the backend API at `https://api.georgesheppard.dev` using auto-generated React Query hooks. The project uses [Orval](https://orval.dev/) to generate TypeScript types and hooks from the OpenAPI schema.

### API Client Architecture

- **Generated Hooks**: Located at `src/api/generated/hooks.ts`
- **HTTP Client**: Axios (configured in `src/lib/axios.ts`)
- **Base URL**: `https://api.georgesheppard.dev` (or `VITE_API_BASE_URL` env variable)
- **React Query**: All API calls use React Query hooks for caching and state management

### Updating the Backend Schema

When the backend API changes, the API client is automatically regenerated during the build process. However, you can also update it manually for development:

#### Manual Update (Optional)

```bash
curl -o openapi.json https://raw.githubusercontent.com/GeorgeSheppard/api.georgesheppard.dev/master/generated/openapi/georgesheppard-spec.json && pnpm generate:api
```

This will:
1. Fetch the latest OpenAPI schema from the API repository
2. Generate TypeScript types and React Query hooks in `src/api/generated/hooks.ts`

Then commit the changes:
```bash
git add src/api/generated/
git commit -m "Update API client"
```

#### Automatic Generation During Build

The `prebuild` script automatically fetches the latest schema and regenerates the API client before every build. This ensures:
- Production builds always use the latest API schema
- Deployments are always in sync with the backend
- No manual steps needed for deployment

To test the full build process locally:

```bash
pnpm build  # Runs prebuild automatically, then builds
```

## Configuration Files

- `vite.config.ts` - Vite configuration
- `wrangler.jsonc` - Cloudflare Pages/Wrangler configuration (SPA routing)
- `orval.config.ts` - Orval configuration for API client generation
- `src/lib/axios.ts` - Axios instance configuration for API calls
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `openapi.json` - OpenAPI schema (source for code generation)
