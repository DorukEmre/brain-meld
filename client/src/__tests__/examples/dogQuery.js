import { gql } from '@apollo/client'

const GET_DOG_QUERY = gql`
  query GetDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`

export { GET_DOG_QUERY }
