console.log(
  '✅ GraphQL Endpoint:',
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT
);
console.log('✅ Admin Secret:', process.env.HASURA_ADMIN_SECRET);

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT, // Hasura の URL
    fetch,
    headers: {
      'x-hasura-admin-secret': process.env.NEXT_PRIVATE_HASURA_ADMIN_SECRET || "test",
    },
  }),
  cache: new InMemoryCache(),
});
