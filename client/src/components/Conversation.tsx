import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { AddDialog } from '@/components/tree/AddDialog'

import client from '@/config/apolloClient'
import { OPENAI_QUERY } from '@/graphql/openaiQueries'
import { NodeModel, CustomData } from '@/types'

interface Props {
  treeData: NodeModel<CustomData>[]
  setTreeData: Dispatch<SetStateAction<NodeModel<CustomData>[]>>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleSubmitAddNode: (newNode: Omit<NodeModel<CustomData>, 'id'>) => void
  responses: string[]
  setResponses: Dispatch<SetStateAction<string[]>>
}

const Conversation = (props: Props) => {
  const { responses, setResponses } = props
  const lastResponseRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [selectedResponse, setSelectedResponse] = useState({
    response: '',
    index: 0,
  })
  const [isCopied, setIsCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(-1)

  useEffect(() => {
    // Scroll to last response when new response added
    lastResponseRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [responses.length])

  const handleGenerate = async (e: React.SyntheticEvent, index: number) => {
    e.preventDefault()

    // Add context messages to track conversation
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

    // Prompt is bottom input or a previous response
    const prompt = index === -1 ? input : responses[index]
    // Join prompt an context if any
    const promptWithContext =
      context !== '' ? [context, prompt].join('\n') : prompt

    // Make query
    const { data } = await client.query({
      query: OPENAI_QUERY,
      variables: { prompt: promptWithContext },
    })

    console.log(promptWithContext)
    console.log(data.generateText)
    const sanitizedResponse = data.generateText.replace(/^\s*[\r\n]{2}/, '')

    if (responses.length === 0) {
      // first prompt
      setResponses([input, sanitizedResponse])
    } else if (index === -1) {
      // input is the prompt
      setResponses([...responses, input, sanitizedResponse])
    } else {
      setResponses([...responses, sanitizedResponse])
    }

    setInput('')
  }

  const handleOpenDialog = (response: string, index: number) => {
    setSelectedResponse({ response, index })
    props.setOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedResponse({ response: '', index: 0 })
    props.setOpen(false)
  }

  const handleCopyText = (index: number) => {
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
      <>
        {props.open && (
          <AddDialog
            tree={props.treeData}
            onClose={handleCloseDialog}
            // @ts-ignore
            onSubmit={props.handleSubmitAddNode}
            droppable={false}
            selectedResponse={selectedResponse}
          />
        )}
      </>
      <div className="chatbox-container">
        <div className="chatbox-conversation">
          {responses.length > 0 &&
            responses.map((response, index) => (
              <div key={index} className="chatbox-response">
                <form onSubmit={(e) => handleGenerate(e, index)}>
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
                    />
                  </label>
                  <button type="submit">Generate</button>
                  <button
                    type="button"
                    onClick={() => handleOpenDialog(response, index)}
                  >
                    Save
                  </button>
                  <button type="button" onClick={() => handleCopyText(index)}>
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
        <div className="chatbox-input-container">
          <form onSubmit={(e) => handleGenerate(e, -1)}>
            <label>
              <TextareaAutosize
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="chatbox-input--text"
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

export default Conversation
