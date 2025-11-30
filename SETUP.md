# Khaki Team Auth App - Setup Guide

## Project Overview

This is an Angular 20 application with AWS Cognito authentication integration. The project uses standalone components, zoneless architecture, and follows Angular best practices.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- AWS Cognito User Pool (configured separately)

## Installation

Dependencies have been installed:
- Angular 20.3.x
- AWS SDK for JavaScript v3 (@aws-sdk/client-cognito-identity-provider)
- fast-check (for property-based testing)
- TypeScript 5.9.x with strict mode enabled

## Configuration

### AWS Cognito Setup

Before running the application, you need to configure your AWS Cognito User Pool settings:

1. Open `src/environments/environment.ts` (for development)
2. Replace the placeholder values with your actual AWS Cognito configuration:
   - `region`: Your AWS region (e.g., 'us-east-1')
   - `userPoolId`: Your Cognito User Pool ID
   - `userPoolClientId`: Your Cognito User Pool Client ID

3. For production, update `src/environments/environment.prod.ts` with production values

### TypeScript Configuration

The project is configured with:
- Strict mode enabled
- All strict type checking flags enabled
- Experimental decorators enabled
- Target: ES2022
- Module: preserve (for Angular 20)

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests with Karma
- `npm run watch` - Build in watch mode

## Project Structure

```
khaki-team-auth-app/
├── src/
│   ├── app/              # Application components
│   ├── environments/     # Environment configurations
│   ├── main.ts          # Application entry point
│   └── styles.sass      # Global styles
├── angular.json         # Angular CLI configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Testing

The project uses:
- **Jasmine** for unit testing
- **Karma** for test running
- **fast-check** for property-based testing

Run tests with: `npm test`

## Next Steps

1. Configure AWS Cognito User Pool settings in environment files
2. Implement authentication services and components
3. Add routing and guards for protected routes
4. Implement UI components for sign-up, login, and authenticated views

## Notes

- The application uses zoneless architecture (no zone.js)
- All components are standalone (no NgModules)
- Sass is used for styling (`.sass` syntax)
- Environment file replacement is configured for production builds
