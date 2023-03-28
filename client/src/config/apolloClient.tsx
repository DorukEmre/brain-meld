import fetch from 'cross-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:5000/graphql', fetch }),
  cache: new InMemoryCache(),
})

// import { ApolloClient, InMemoryCache } from '@apollo/client'

// const client = new ApolloClient({
//   uri: 'http://localhost:5000/graphql',
//   cache: new InMemoryCache(),
// })

export default client
