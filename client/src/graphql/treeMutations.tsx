import { gql } from '@apollo/client'

const ADD_TREENODE = gql`
  mutation AddTreeNode(
    $id: Int!
    $parent: Int!
    $droppable: Boolean!
    $text: String!
    $body: String
  ) {
    addTreeNode(
      id: $id
      parent: $parent
      droppable: $droppable
      text: $text
      data: { body: $body }
    ) {
      id
      parent
      droppable
      text
      data {
        body
      }
    }
  }
`

const UPDATE_TREENODE = gql`
  mutation UpdateTreeNode($id: Int!, $parent: Int!, $text: String!) {
    updateTreeNode(id: $id, parent: $parent, text: $text) {
      id
      parent
      droppable
      text
    }
  }
`

const DELETE_TREENODE = gql`
  mutation DeleteTreeNode($id: Int!) {
    deleteTreeNode(id: $id) {
      id
    }
  }
`

export { ADD_TREENODE, UPDATE_TREENODE, DELETE_TREENODE }
