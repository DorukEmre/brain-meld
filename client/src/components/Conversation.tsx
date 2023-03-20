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

import styles from '@/styles/Conversation.module.css'

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Pressing 'Enter' sends query. But still line break if shift key is pressed
    if (e.key === 'Enter' && !e.shiftKey) {
      handleGenerate(e, -1)
    }
  }

  const handleTweet = (content: string) => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      content,
    )}`
    window.open(tweetUrl, '_blank', 'noopener,noreferrer')
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
      <div className={styles.chatboxContainer}>
        <div className={styles.chatboxConversation}>
          {responses.length > 0 &&
            responses.map((response, index) => (
              <div key={index} className={styles.chatboxResponse}>
                <form onSubmit={(e) => handleGenerate(e, index)}>
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
                  <div className={styles.chatboxResponseButtons}>
                    <button
                      type="submit"
                      className={styles.chatboxResponseButton}
                    >
                      {loading && loadingIndex === index ? (
                        <CircularProgress size={18} />
                      ) : (
                        <>
                          <SendIcon sx={{ fontSize: 20 }} />
                          <p>Send</p>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDialog(response.content)}
                      className={styles.chatboxResponseButton}
                    >
                      <>
                        <NoteAddIcon sx={{ fontSize: 20 }} />
                        <p>Save</p>
                      </>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(index)}
                      className={styles.chatboxResponseButton}
                    >
                      {isCopied && copiedIndex === index ? (
                        <DoneIcon />
                      ) : (
                        <>
                          <ContentCopyRoundedIcon sx={{ fontSize: 20 }} />
                          <p>Copy</p>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTweet(response.content)}
                      className={styles.chatboxResponseButton}
                    >
                      <svg
                        width="22"
                        height="18"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        role="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.04128 17.7861C4.53883 17.7861 2.21078 17.0602 0.25 15.8165C0.596807 15.857 0.949401 15.8773 1.30683 15.8773C3.38266 15.8773 5.29282 15.1764 6.80944 14.0003C4.87 13.9646 3.23461 12.6968 2.67056 10.9547C2.94041 11.0059 3.21803 11.0338 3.50342 11.0338C3.90767 11.0338 4.2993 10.9798 4.67133 10.8796C2.64431 10.4775 1.11689 8.70468 1.11689 6.5808C1.11689 6.56156 1.11689 6.54327 1.11792 6.52489C1.71505 6.85368 2.39787 7.05133 3.12448 7.07347C1.93514 6.28783 1.15299 4.94488 1.15299 3.42361C1.15299 2.62053 1.37213 1.86754 1.75297 1.21971C3.93781 3.87277 7.20298 5.61776 10.885 5.80097C10.8091 5.47987 10.7701 5.14535 10.7701 4.80118C10.7701 2.38039 12.7543 0.416626 15.2012 0.416626C16.4753 0.416626 17.6267 0.949734 18.4351 1.80197C19.4444 1.60535 20.392 1.23997 21.2484 0.737722C20.9172 1.76154 20.2148 2.62053 19.3002 3.1633C20.1963 3.0572 21.0506 2.82194 21.8444 2.47297C21.2512 3.35223 20.4993 4.12445 19.6342 4.7433C19.643 4.93129 19.6469 5.12031 19.6469 5.31018C19.6469 11.1042 15.1905 17.7861 7.04128 17.7861Z"
                          fill="var(--clr-light-400)"
                        ></path>
                      </svg>
                      <p>Tweet</p>
                    </button>
                  </div>
                  {index === responses.length - 1 && (
                    <div ref={lastResponseRef} />
                  )}
                </form>
              </div>
            ))}
        </div>
        <div className={styles.chatboxInputWrapper}>
          <form onSubmit={(e) => handleGenerate(e, -1)}>
            <div className={styles.chatboxInputContainer}>
              <TextareaAutosize
                value={mainInput}
                onChange={(e) => setMainInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
                className={styles.chatboxInputText}
                maxRows={10}
                minRows={1}
              />
              <button type="submit" className={styles.chatboxInputSendButton}>
                {loading && loadingIndex === -1 ? (
                  <CircularProgress size={18} />
                ) : (
                  <SendIcon sx={{ fontSize: 18 }} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Conversation
