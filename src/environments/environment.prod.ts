/**
 * Production environment configuration
 */
export const environment = {
  production: true,
  aws: {
    region: 'us-east-1',
    userPoolId: 'YOUR_USER_POOL_ID',
    userPoolClientId: 'YOUR_USER_POOL_CLIENT_ID',
  },
};
