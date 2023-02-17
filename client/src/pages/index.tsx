import { gql, useQuery } from '@apollo/client'
import type { NextPageWithLayout } from '@/pages/_app'
import HTMLMetaTags from '@/components/HTMLMetaTags'
import { useEffect, useRef, useState } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'

import TextareaAutosize from '@mui/base/TextareaAutosize'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
})

const Home: NextPageWithLayout = () => {
  const lastResponseRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [responses, setResponses] = useState<string[]>([])
  const [isCopied, setIsCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(-1)

  useEffect(() => {
    lastResponseRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [responses.length])

  const handleSubmit = async (e: React.SyntheticEvent, index: number) => {
    e.preventDefault()

    let context
    if (
      responses.length >= 3 &&
      index !== responses.length - 1 &&
      index !== responses.length - 2
    ) {
      context = responses.slice(-2).join('\n')
    } else if (
      responses.length >= 3 &&
      (index === responses.length - 1 || index === responses.length - 2)
    ) {
      context = [responses[index - 2], responses[index - 1]].join('\n')
    } else if (responses.length === 2 && index === 1) {
      context = responses[0]
    } else {
      context = ''
    }

    const prompt = index === -1 ? input : responses[index]
    const inputWithContext =
      context !== '' ? [context, prompt].join('\n') : prompt

    const { data } = await client.query({
      query: gql`
        query OpenAIQuery($input: String!) {
          generateText(input: $input)
        }
      `,
      variables: { input: inputWithContext },
    })

    console.log(inputWithContext)
    console.log(data.generateText)
    const sanitizedResponse = data.generateText.replace(/^\s*[\r\n]{2}/, '')

    if (responses.length === 0) {
      setResponses([prompt, sanitizedResponse])
    } else if (index === -1) {
      setResponses([...responses, input, sanitizedResponse])
    } else {
      setResponses([...responses, sanitizedResponse])
    }

    setInput('')
  }

  const handleCopy = (e: React.SyntheticEvent, index: number) => {
    navigator.clipboard.writeText(responses[index]).then(() => {
      setIsCopied(true)
      setCopiedIndex(index)
      setTimeout(() => {
        setIsCopied(false)
        setCopiedIndex(-1)
      }, 2000)
    })
  }

  return (
    <>
      <HTMLMetaTags />
      <div className="chatbox-container">
        <div className="chatbox-conversation">
          {responses.length > 0 &&
            responses.map((response, index) => (
              <div key={index} className="chatbox-response">
                <form onSubmit={(e) => handleSubmit(e, index)}>
                  <label>
                    <TextareaAutosize
                      value={response}
                      onChange={(e) => {
                        const updatedResponses = [...responses]
                        updatedResponses[index] = e.target.value
                        setResponses(updatedResponses)
                      }}
                      maxRows={20}
                      minRows={1}
                      cols={50}
                      // ref={
                      //   index === responses.length - 1 ? lastResponseRef : null
                      // }
                    />
                  </label>
                  <button type="submit">Generate</button>
                  {/* <button>Save</button> */}
                  <button type="button" onClick={(e) => handleCopy(e, index)}>
                    {isCopied && index === copiedIndex
                      ? 'Copied!'
                      : 'Copy Text'}
                  </button>
                  {index === responses.length - 1 && (
                    <div ref={lastResponseRef} />
                  )}
                </form>
              </div>
            ))}
        </div>

        <div className="chatbox-prompt">
          <form onSubmit={(e) => handleSubmit(e, -1)}>
            <label>
              <TextareaAutosize
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="chatbox-prompt--input"
                maxRows={10}
                minRows={1}
              />
            </label>
            <button type="submit">Generate</button>
          </form>
        </div>
      </div>
    </>
  )
}

// Home.getLayout = (page) => page

export default Home
