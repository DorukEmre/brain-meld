import { gql } from '@apollo/client'

const OPENAI_QUERY = gql`
  query OpenAIQuery($messages: [MessageInput!]!) {
    generateText(input: $messages) {
      role
      content
    }
  }
`

export { OPENAI_QUERY }
