import { gql, useQuery } from '@apollo/client'
import type { NextPageWithLayout } from '@/pages/_app'
import HTMLMetaTags from '@/components/HTMLMetaTags'
import { useState } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
})

type Props = {}
const Home: NextPageWithLayout<Props> = (props) => {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const { data } = await client.query({
      query: gql`
        query OpenAIQuery($input: String!) {
          generateText(input: $input)
        }
      `,
      variables: { input },
    })

    setResponse(data.generateText)
  }

  return (
    <>
      <HTMLMetaTags />
      <h1>Main content</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Text:
            <input
              type="text"
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
              }}
            />
          </label>
          <button type="submit">Generate</button>
        </form>
        {response && <p>{response}</p>}
      </div>
    </>
  )
}

// Home.getLayout = (page) => page

export default Home
