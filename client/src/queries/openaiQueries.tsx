import { gql } from '@apollo/client'

const OPENAI_QUERY = gql`
  query OpenAIQuery($prompt: String!) {
    generateText(prompt: $prompt)
  }
`

export { OPENAI_QUERY }
