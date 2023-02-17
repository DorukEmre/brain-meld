import { createSchema } from 'graphql-yoga'

import getOpenAI from '../middleware/openai.js'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      generateText(prompt: String!): String
    }
  `,
  resolvers: {
    Query: {
      // args is the second parameter
      generateText: async (_, { prompt }) => getOpenAI(_, { prompt }),
    },
  },
})
