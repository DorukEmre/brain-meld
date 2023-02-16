import { createSchema } from 'graphql-yoga'

import getOpenAI from '../middleware/openai.js'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      generateText(input: String!): String
    }
  `,
  resolvers: {
    Query: {
      // args is the second parameter
      generateText: async (_, { input }) => getOpenAI(_, { input }),
    },
  },
})
