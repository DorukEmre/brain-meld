import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import { NodeModel, CustomData } from '@/types'

import styles from '@/styles/SelectedPrompt.module.css'
import { useEffect, useState } from 'react'

interface Props {
  node: NodeModel<CustomData>
  handlePromptTitleChange: (id: NodeModel['id'], value: string) => void
  handlePromptBodyChange: (id: NodeModel['id'], value: string) => void
  handleDeletePrompt: (id: NodeModel['id']) => void
}

const SelectedPrompt = (props: Props) => {
  const { node } = props
  const [editTitle, setEditTitle] = useState(false)
  const [editBody, setEditBody] = useState(false)
  const [promptTitle, setPromptTitle] = useState('')
  const [promptBody, setPromptBody] = useState('')

  useEffect(() => {
    console.log(node)
    setPromptTitle(node.text)
    if (node.data?.body) setPromptBody(node.data.body)
  }, [node])

  const handleEditTitle = () => {
    setEditTitle(true)
  }
  const handleEditBody = () => {
    setEditBody(true)
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptTitle(e.target.value)
  }
  const handleSubmitTitleChange = () => {
    props.handlePromptTitleChange(node.id, promptTitle)
    setEditTitle(false)
  }
  const handleCancelTitleChange = () => {
    setPromptTitle(promptTitle)
    setEditTitle(false)
  }

  const handleChangeBody = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptBody(e.target.value)
  }
  const handleSubmitBodyChange = () => {
    props.handlePromptBodyChange(node.id, promptBody)
    setEditBody(false)
  }
  const handleCancelBodyChange = () => {
    setPromptBody(promptBody)
    setEditBody(false)
  }

  return (
    <article className={styles.container}>
      <div className={styles.titleWrapper}>
        {!editTitle ? (
          <>
            <h1 className={styles.promptTitle}>{promptTitle}</h1>
            <div className={styles.actionButtons}>
              <IconButton size="small" onClick={handleEditTitle}>
                <EditIcon fontSize="small" className={styles.actionButton} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => props.handleDeletePrompt(node.id)}
              >
                <Delete fontSize="small" className={styles.actionButton} />
              </IconButton>
            </div>
          </>
        ) : (
          <div className={styles.inputWrapper}>
            <TextField
              className={styles.textField}
              value={promptTitle}
              onChange={handleChangeTitle}
              multiline={true}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'var(--clr-compl-300)',
                  padding: '0',
                  borderRadius: '6px 6px 0 0',
                  width: '100%',
                },
              }}
            />
            <div className={styles.renameButtons}>
              <IconButton
                className={styles.editButton}
                onClick={handleSubmitTitleChange}
                disabled={promptTitle === ''}
                size="small"
              >
                <CheckIcon className={styles.editIcon} fontSize="small" />
              </IconButton>
              <IconButton
                className={styles.editButton}
                onClick={handleCancelTitleChange}
                size="small"
              >
                <CloseIcon className={styles.editIcon} fontSize="small" />
              </IconButton>
            </div>
          </div>
        )}
      </div>
      <div className={styles.bodyWrapper}>
        {!editBody ? (
          <>
            <pre className={styles.promptBody}>{promptBody}</pre>
            <div className={styles.actionButtons}>
              <IconButton size="small" onClick={handleEditBody}>
                <EditIcon fontSize="small" className={styles.actionButton} />
              </IconButton>
            </div>
          </>
        ) : (
          <div className={styles.inputWrapper}>
            <TextField
              className={styles.textField}
              value={promptBody}
              onChange={handleChangeBody}
              multiline={true}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'var(--clr-compl-300)',
                  padding: '0',
                  borderRadius: '6px 6px 0 0',
                  width: '100%',
                },
              }}
            />
            <div className={styles.renameButtons}>
              <IconButton
                className={styles.editButton}
                onClick={handleSubmitBodyChange}
                disabled={promptBody === ''}
                size="small"
              >
                <CheckIcon className={styles.editIcon} fontSize="small" />
              </IconButton>
              <IconButton
                className={styles.editButton}
                onClick={handleCancelBodyChange}
                size="small"
              >
                <CloseIcon className={styles.editIcon} fontSize="small" />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export default SelectedPrompt
