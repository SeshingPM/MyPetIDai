# PetDocument - Secure Pet Document Management

## About PetDocument

PetDocument provides a comprehensive platform for pet owners to securely store and manage their pets' important documents, including:

- Vaccination records
- Medical history
- Insurance policies
- Medication schedules
- Care instructions
- And more!

The application offers a user-friendly interface with features like document storage, reminders, and secure sharing with veterinarians or family members.

## Tech Stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- React Query
- Supabase (Auth, Database, Storage, Edge Functions)
- Stripe (Payment Processing)

## Development

### Prerequisites

- Node.js (LTS version)
- npm or bun
- Supabase local instance (optional for local development)

### Environment Setup

1. By default, the application is configured to use:

   - Production Supabase
   - Test Stripe environment

2. To use local Supabase, copy the local environment example file:

   ```sh
   cp .env.local.example .env.local
   ```

3. The `.env.local` file will override the default configuration to use your local Supabase instance.

4. Install dependencies:

   ```sh
   npm i
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

### Environment Configuration

The application uses different environment files:

- `.env` - Default configuration (committed to git)
- `.env.local` - Local development overrides (not committed to git)
- `.env.production` - Production builds
- `.env.test` - Test environment

Default configuration:

```
# Supabase - Production by default
VITE_SUPABASE_URL=https://yyqodsrvslheazteialw.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_supabase_key

# Stripe - Test mode by default
VITE_STRIPE_PUBLIC_KEY=pk_test_your_test_key
```

For Supabase local development and environment configuration, see our [Environment Setup Guide](./docs/environment-setup.md).

## Documentation

- [Supabase Implementation Reference](./docs/supabase.md) - Comprehensive reference for all Supabase-related implementation details
- [Environment Setup Guide](./docs/environment-setup.md) - Detailed guide for managing environment configuration across different environments
- [Checkout Flow Implementation](./docs/checkout-flow-implementation.md) - Guide for the Stripe checkout flow implementation

## Deployment

The application can be deployed to your hosting provider of choice. The build command is:

```sh
# For production build
npm run build

# For development build
npm run build:dev
```

## PetDocument.com

This application is designed to work with the PetDocument.com domain.

## SEO Implementation

This application has a comprehensive SEO setup to optimize for search engines and improve rankings for key terms like "pet documents", "pet health records", and "vaccination reminders for pets".

### Key SEO Components

1. **Dynamic Meta Tags**: Using `react-helmet-async` to provide per-route meta information.
2. **Structured Data**: JSON-LD implementation for rich results in search engines.
3. **Sitemap**: Automatically generated based on the application routes.
4. **Robots.txt**: Environment-specific crawler instructions.
5. **Open Graph Tags**: Social media optimization.

### Maintaining SEO

When working with this codebase, please follow these guidelines:

#### Page Components

- Always include the `<SEO>` component at the top of page components
- Provide relevant `title`, `description`, and `keywords` for each page
- Target primary keywords: "pet documents", "pet health records", "vaccination reminders for pets"

```jsx
<SEO
  title="Page Title | PetDocument"
  description="Clear, keyword-rich description under 160 characters"
  keywords="pet documents, pet health records, and other relevant keywords"
/>
```

#### Structured Data

- Use the schema helpers in `src/lib/schema/` to generate structured data
- For new page types, add schema generators and update the `generateSchemaByPageType` function

#### Sitemap Generation

The sitemap is automatically generated during the build process. To regenerate:

```
npm run generate-sitemap
```

If you add new routes to the application:

1. Update the `PUBLIC_ROUTES` array in `scripts/generate-sitemap.js`
2. Run the generation script

#### Google Search Console

To connect this app with Google Search Console:

1. Create a property in Search Console for the domain
2. Update the verification ID in the `.env` file:
   ```
   GOOGLE_VERIFICATION_ID=your-verification-code
   ```
3. Submit the sitemap URL: `https://petdocument.com/sitemap.xml`

### Migration to Next.js

This SEO implementation is designed to be easily migrated to Next.js in the future:

- Replace `react-helmet-async` with Next.js Metadata API
- Use App Router's built-in sitemap generation
- Convert JSON-LD components to use Next.js `generateMetadata` functions

Refer to the comments marked with `MIGRATION NOTE:` throughout the codebase for specific migration instructions.

## Development

### Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

This will automatically generate the sitemap before building the production version.
