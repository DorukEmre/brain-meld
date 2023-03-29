import { gql } from '@apollo/client'

const DELETE_DOG_MUTATION = gql`
  mutation deleteDog($name: String!) {
    deleteDog(name: $name) {
      id
      name
      breed
    }
  }
`

export { DELETE_DOG_MUTATION }
