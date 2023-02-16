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
  const [text, setText] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { data } = await client.query({
      query: gql`
        query OpenAIQuery($text: String!) {
          generateText(text: $text)
        }
      `,
      variables: { text },
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
              value={text}
              onChange={(event) => {
                setText(event.target.value)
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
