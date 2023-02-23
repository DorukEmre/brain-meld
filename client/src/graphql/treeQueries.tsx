import { gql } from '@apollo/client'

const GET_TREENODES = gql`
  query {
    allTreeNodes {
      id
      parent
      droppable
      text
    }
  }
`

export { GET_TREENODES }
