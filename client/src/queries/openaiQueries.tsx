import { gql } from '@apollo/client'

const OPENAI_QUERY = gql`
  query OpenAIQuery($input: String!) {
    generateText(input: $input)
  }
`

export { OPENAI_QUERY }
