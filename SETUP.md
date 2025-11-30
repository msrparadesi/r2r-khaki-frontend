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

## Authentication Flow

### Sign-Up Process

The application implements a complete AWS Cognito sign-up flow with email verification:

1. **User Registration**: Users provide email and password
2. **Email Verification**: After successful registration, users receive a 6-digit verification code via email
3. **Code Confirmation**: Users enter the verification code to confirm their account
4. **Account Activation**: Once confirmed, users can log in

### Key Features

- **Email Verification**: Automatic verification code delivery via AWS Cognito
- **Code Resend**: Users can request a new verification code if needed
- **Error Handling**: Comprehensive error messages for various scenarios (invalid code, expired code, etc.)
- **Retry Logic**: Network failures are automatically retried with exponential backoff
- **User-Friendly UI**: Clear feedback and loading states throughout the process

### Cognito User Pool Requirements

For the email verification flow to work, ensure your Cognito User Pool is configured with:
- Email as a required attribute
- Email verification enabled
- Email delivery configured (either Cognito default or Amazon SES)

## Next Steps

1. Configure AWS Cognito User Pool settings in environment files
2. Ensure email verification is enabled in your Cognito User Pool
3. Test the complete sign-up and verification flow
4. Customize email templates in AWS Cognito console (optional)

## Notes

- The application uses zoneless architecture (no zone.js)
- All components are standalone (no NgModules)
- Sass is used for styling (`.sass` syntax)
- Environment file replacement is configured for production builds
