import { gql } from '@apollo/client'

const GET_TREENODES = gql`
  query {
    allTreeNodes {
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

export { GET_TREENODES }
