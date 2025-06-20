# Environment Setup

This document provides detailed information about the environment setup for the PetDocument project, focusing on the differences between test and production environments for Supabase configurations and application environment variables.

## Environment Structure

The project uses multiple environments:

1. **Local Development**: For local development and testing
2. **Test Environment**: Staging environment for pre-production testing
3. **Production Environment**: Live application environment

## Supabase Configuration Files

Each environment has its own Supabase configuration file:

- **Local Development**: [`supabase/config.toml`](../supabase/config.toml)
- **Test Environment**: [`supabase/config.test.toml`](../supabase/config.test.toml)
- **Production Environment**: [`supabase/config.prod.toml`](../supabase/config.prod.toml)

### Key Differences Between Environments

| Feature | Test Environment | Production Environment |
|---------|-----------------|------------------------|
| Database Pooling | Smaller connection pool | Larger connection pool for higher traffic |
| Storage Quotas | Limited storage quotas | Higher storage quotas |
| Function Timeouts | Shorter timeouts for testing | Longer timeouts for complex operations |
| Auth Settings | Test-specific JWT expiry | Production-appropriate JWT expiry |

## Edge Function Environment Variables

Edge Functions have environment-specific configuration files:

- **Local Development**: [`supabase/functions/.env`](../supabase/functions/.env)
- **Test Environment**: [`supabase/functions/.env.test`](../supabase/functions/.env.test)
- **Production Environment**: [`supabase/functions/.env.prod`](../supabase/functions/.env.prod)

### Key Differences in Edge Function Configurations

| Variable | Test Environment | Production Environment |
|----------|-----------------|------------------------|
| `STRIPE_SECRET_KEY` | Test mode Stripe key | Live mode Stripe key |
| `STRIPE_WEBHOOK_SECRET` | Test webhook secret | Production webhook secret |
| `POSTMARK_API_TOKEN` | Test Postmark account | Production Postmark account |
| `EMAIL_FROM` | test@petdocument.com | no-reply@petdocument.com |
| `SITE_URL` | https://test.petdocument.com | https://petdocument.com |

## Frontend Environment Variables

The frontend application uses different environment files:

- **Template**: [`.env.example`](../.env.example)
- **Local Development**: [`.env.local.example`](../.env.local.example)
- **Test Environment**: [`.env.test`](../.env.test)
- **Production Environment**: [`.env.production`](../.env.production)

### Key Differences in Frontend Configurations

| Variable | Test Environment | Production Environment |
|----------|-----------------|------------------------|
| `VITE_APP_ENV` | test | production |
| `VITE_SUPABASE_URL` | Test Supabase URL | Production Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Test anon key | Production anon key |
| `VITE_STRIPE_PUBLIC_KEY` | Test mode Stripe key | Live mode Stripe key |
| `VITE_ENABLE_ANALYTICS` | false | true |

## Environment Switching

### Deployment Scripts

The project includes scripts for deploying to different environments:

- **Test Environment**: [`scripts/deploy-test.sh`](../scripts/deploy-test.sh)
- **Production Environment**: [`scripts/deploy-prod.sh`](../scripts/deploy-prod.sh)

These scripts handle:
1. Setting the correct environment variables
2. Deploying the correct Supabase configuration
3. Deploying Edge Functions with environment-specific settings
4. Building and deploying the frontend application

### Manual Environment Switching

To manually switch between environments:

1. **For Supabase CLI operations**:
   ```bash
   # For test environment
   npx supabase link --project-ref YOUR_TEST_PROJECT_REF
   
   # For production environment
   npx supabase link --project-ref YOUR_PROD_PROJECT_REF
   ```

2. **For Edge Function deployment**:
   ```bash
   # Deploy to test
   npx supabase functions deploy --project-ref YOUR_TEST_PROJECT_REF
   
   # Deploy to production
   npx supabase functions deploy --project-ref YOUR_PROD_PROJECT_REF
   ```

3. **For frontend builds**:
   ```bash
   # Build for test
   npm run build:test
   
   # Build for production
   npm run build:prod
   ```

## Environment Configuration Loading

The application loads environment variables through a centralized configuration module:

- **Frontend Config**: [`src/config/env.ts`](../src/config/env.ts)

This module:
1. Loads the appropriate environment variables based on the current environment
2. Validates that required variables are present
3. Provides typed access to environment variables throughout the application

## Best Practices

1. **Never commit sensitive environment variables** to version control
2. **Always use the correct environment** for the task at hand
3. **Test changes in the test environment** before deploying to production
4. **Use environment-specific feature flags** for gradual rollouts
5. **Monitor environment-specific logs** for issues