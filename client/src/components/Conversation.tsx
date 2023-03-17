import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { AddDialog } from '@/components/tree/AddDialog'

import client from '@/config/apolloClient'
import { OPENAI_QUERY } from '@/graphql/openaiQueries'
import { NodeModel, CustomData } from '@/types'
import { ChatCompletionRequestMessage } from 'openai/dist/api'

import SendIcon from '@mui/icons-material/Send'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import DoneIcon from '@mui/icons-material/Done'
import CircularProgress from '@mui/material/CircularProgress'

interface Props {
  treeData: NodeModel<CustomData>[]
  setTreeData: Dispatch<SetStateAction<NodeModel<CustomData>[]>>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleSubmitAddNode: (newNode: Omit<NodeModel<CustomData>, 'id'>) => void
  responses: ChatCompletionRequestMessage[]
  setResponses: Dispatch<SetStateAction<ChatCompletionRequestMessage[]>>
}

const Conversation = (props: Props) => {
  const { responses, setResponses } = props
  const [loading, setLoading] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(-100)
  const lastResponseRef = useRef<HTMLDivElement>(null)
  const [mainInput, setMainInput] = useState('')
  const [selectedResponse, setSelectedResponse] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(-100)

  useEffect(() => {
    // Scroll to last response when new response added
    lastResponseRef.current?.scrollIntoView({ behavior: 'smooth' })
    // console.log('responses: ', responses)
  }, [responses.length])

  const handleGenerate = async (e: React.FormEvent, index: number) => {
    e.preventDefault()
    setLoading(true)
    setLoadingIndex(index)

    // If Generate from input at bottom, add it to the end of the responses array
    // If Generate from any other response, truncate up till that response
    let messages: ChatCompletionRequestMessage[]
    if (index === -1) {
      messages = [...responses, { role: 'user', content: mainInput }]
    } else {
      messages = responses.slice(0, index + 1)
    }

    // console.log('messages: ', messages)

    // Make query
    const { data } = await client.query({
      query: OPENAI_QUERY,
      variables: { messages: messages },
    })

    // console.log(data.generateText)
    setLoading(false)
    setLoadingIndex(-100)
    setResponses([
      ...messages,
      { role: data.generateText.role, content: data.generateText.content },
    ])

    setMainInput('')
  }

  const handleOpenDialog = (response: string) => {
    setSelectedResponse(response)
    props.setOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedResponse('')
    props.setOpen(false)
  }

  const handleCopyText = (index: number) => {
    navigator.clipboard.writeText(responses[index].content).then(() => {
      setIsCopied(true)
      setCopiedIndex(index)
      setTimeout(() => {
        setIsCopied(false)
        setCopiedIndex(-100)
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
                      value={response.content}
                      onChange={(e) => {
                        const updatedResponses = [...responses]
                        updatedResponses[index] = {
                          role: 'user',
                          content: e.target.value,
                        }
                        setResponses(updatedResponses)
                      }}
                      maxRows={20}
                      minRows={1}
                      cols={50}
                    />
                  </label>
                  <button type="submit">
                    {loading && loadingIndex === index ? (
                      <CircularProgress />
                    ) : (
                      <SendIcon />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDialog(response.content)}
                  >
                    <NoteAddIcon />
                  </button>
                  <button type="button" onClick={() => handleCopyText(index)}>
                    {isCopied && copiedIndex === index ? (
                      <DoneIcon />
                    ) : (
                      <ContentCopyRoundedIcon />
                    )}
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
                value={mainInput}
                onChange={(e) => setMainInput(e.target.value)}
                className="chatbox-input--text"
                maxRows={10}
                minRows={1}
              />
            </label>
            <button type="submit">
              {loading && loadingIndex === -1 ? (
                <CircularProgress />
              ) : (
                <SendIcon />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Conversation
