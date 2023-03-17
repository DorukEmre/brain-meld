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
      data: Data
    }
    type Data {
      body: String
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
    type Mutation {
      addTreeNode(
        id: Int!
        parent: Int!
        droppable: Boolean!
        text: String!
        data: DataInput
      ): TreeNode

      updateTreeNode(id: Int!, parent: Int!, text: String!): TreeNode

      deleteTreeNode(id: Int!): TreeNode
    }
    input DataInput {
      body: String
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
        const treeNode = new TreeNode({ id, parent, droppable, text, data })
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
