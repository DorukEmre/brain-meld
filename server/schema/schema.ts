import { createSchema } from 'graphql-yoga'

import getOpenAI from '../middleware/openai.js'

import TreeNode from '../models/TreeNode.model.js'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Data {
      body: String
    }
    type TreeNode {
      id: Int!
      parent: Int!
      droppable: Boolean!
      text: String!
      data: Data
    }
    input MessageInput {
      role: String!
      content: String!
    }
    type Message {
      role: String!
      content: String!
    }
    type Query {
      generateText(input: [MessageInput!]!): Message!
      allTreeNodes: [TreeNode]
    }
    input DataInput {
      body: String
    }
    type Mutation {
      addTreeNode(
        id: Int!
        parent: Int!
        droppable: Boolean!
        text: String!
        data: DataInput
      ): TreeNode

      updateTreeNode(
        id: Int!
        parent: Int!
        text: String!
        data: DataInput
      ): TreeNode

      deleteTreeNode(id: Int!): TreeNode
    }
  `,
  resolvers: {
    Query: {
      // args is the second parameter
      generateText: async (_, { input }) => getOpenAI(_, { input }),
      allTreeNodes: () => TreeNode.find(),
    },
    Mutation: {
      addTreeNode: async (_, { id, parent, droppable, text, data }) => {
        return TreeNode.create({ id, parent, droppable, text, data })
      },
      updateTreeNode: async (_, { id, parent, text, data: { body } }) => {
        return TreeNode.findOneAndUpdate(
          { id },
          {
            $set: {
              parent,
              text,
              data: { body },
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
