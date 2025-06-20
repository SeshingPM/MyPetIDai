# PetDocument Development Guidelines

## Build/Run Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run eslint on all files
- `npm run preview` - Preview production build

## Code Style & Conventions
- **Imports**: Use alias imports from `@/*` for project files
- **Components**: Use functional components with TypeScript interfaces
- **Types**: Props should have proper interfaces with optional props marked using `?`
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **State**: Prefer hooks (`useState`, `useEffect`, `useContext`) for state management
- **Context**: Use context providers for shared state (see `src/contexts/`)
- **Error Handling**: Use try/catch blocks with toast notifications for user feedback
- **File Structure**: Related components should be grouped in subdirectories
- **CSS**: Use Tailwind classes with `cn()` utility for conditional classes
- **Forms**: Use `react-hook-form` with `zod` for validation

## Component Pattern
Components should follow the pattern seen in the codebase - functional components with TypeScript interfaces for props, using React hooks for state management.