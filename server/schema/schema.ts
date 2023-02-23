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
      body: String
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
        body: String
      ): TreeNode

      updateTreeNode(id: Int!, parent: Int!, text: String!): TreeNode

      deleteTreeNode(id: Int!): TreeNode
    }
  `,
  resolvers: {
    Query: {
      // args is the second parameter
      generateText: async (_, { prompt }) => getOpenAI(_, { prompt }),
      allTreeNodes: () => TreeNode.find(),
    },
    Mutation: {
      addTreeNode: async (_, { id, parent, droppable, text, body }) => {
        const treeNode = new TreeNode({ id, parent, droppable, text, body })
        await treeNode.save()
        return treeNode
      },
      updateTreeNode: async (_, { id, parent, text }) => {
        return TreeNode.findOneAndUpdate(
          { id },
          {
            $set: {
              parent,
              text,
            },
          },
          { new: true },
        )
      },
      deleteTreeNode: async (_, { id }) => {
        // Delete all nodes that have this node id for parent
        await TreeNode.deleteMany({ parent: id })
        // Delete node with this id
        return TreeNode.findOneAndDelete({ id })
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
