import { gql } from '@apollo/client'

const ADD_TREENODE = gql`
  mutation AddTreeNode(
    $id: Int!
    $parent: Int!
    $droppable: Boolean!
    $text: String!
  ) {
    addTreeNode(id: $id, parent: $parent, droppable: $droppable, text: $text) {
      id
      parent
      droppable
      text
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
