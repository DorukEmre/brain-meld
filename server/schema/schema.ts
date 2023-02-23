import { createSchema } from 'graphql-yoga'

import getOpenAI from '../middleware/openai.js'

import TreeNode from '../models/TreeNode.model.js'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type TreeNode {
      id: Int!
      parent: Int!
      droppable: Boolean!
      text: String!
    }
    type Query {
      generateText(prompt: String!): String
      allTreeNodes: [TreeNode]
    }
    type Mutation {
      addTreeNode(
        id: Int!
        parent: Int!
        droppable: Boolean!
        text: String!
      ): TreeNode
    }
  `,
  resolvers: {
    Query: {
      // args is the second parameter
      generateText: async (_, { prompt }) => getOpenAI(_, { prompt }),
      allTreeNodes: () => TreeNode.find(),
    },
    Mutation: {
      addTreeNode: async (_, { id, parent, droppable, text }) => {
        const treeNode = new TreeNode({ id, parent, droppable, text })
        await treeNode.save()
        return treeNode
      },
    },
  },
})

// query {
//   allTreeNodes {
//     id
//     parent
//     droppable
//     text
//   }
// }

// mutation {
//   addTreeNode(id: 1, parent: 0, droppable: true, text: "New TreeNode") {
//     id
//     parent
//     droppable
//     text
//   }
// }
