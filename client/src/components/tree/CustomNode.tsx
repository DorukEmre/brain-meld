import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import IconButton from '@mui/material/IconButton'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ArrowRight from '@mui/icons-material/ArrowRight'
import EditIcon from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import PreviewIcon from '@mui/icons-material/Preview'

import { useDragOver } from '@minoru/react-dnd-treeview'
import { NodeModel, CustomData } from '@/types'
import { TypeIcon } from './TypeIcon'
import styles from './styles/CustomNode.module.css'

type Props = {
  node: NodeModel<CustomData>
  depth: number
  isOpen: boolean
  onToggle: (id: NodeModel['id']) => void
  onDelete: (id: NodeModel['id']) => void
  onTitleChange: (id: NodeModel['id'], value: string) => void
  onAddFolder: (id: NodeModel['id']) => void
  handleSelectNode: (id: NodeModel['id']) => void
}

export const CustomNode: React.FC<Props> = (props) => {
  const { id, droppable, text } = props.node

  const [hover, setHover] = useState(false)
  const [visibleInput, setVisibleInput] = useState(false)
  const [titleText, setTitleText] = useState(text)

  const indent = props.depth * 24

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onToggle(id)
  }

  const handleShowInput = () => {
    setVisibleInput(true)
  }

  const handleCancel = () => {
    setTitleText(text)
    setVisibleInput(false)
    setHover(false)
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleText(e.target.value)
  }

  const handleSubmit = () => {
    setVisibleInput(false)
    props.onTitleChange(id, titleText)
    setHover(false)
  }

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle)

  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent }}
      {...dragOverProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ''
        }`}
      >
        {droppable && (
          <div onClick={handleToggle}>
            <ArrowRight />
          </div>
        )}
      </div>
      <div className={styles.typeIconWrapper}>
        {/* Folder-File icon */}
        <TypeIcon droppable={droppable ? droppable : false} />
      </div>

      <>
        {visibleInput ? (
          <div className={styles.inputWrapper}>
            <TextField
              className={styles.textField}
              value={titleText}
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
                onClick={handleSubmit}
                disabled={titleText === ''}
                size="small"
              >
                <CheckIcon className={styles.editIcon} fontSize="small" />
              </IconButton>
              <IconButton
                className={styles.editButton}
                onClick={handleCancel}
                size="small"
              >
                <CloseIcon className={styles.editIcon} fontSize="small" />
              </IconButton>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.labelGridItem}>
              <Typography
                variant="body2"
                onClick={(e) => {
                  handleToggle(e)
                  if (!droppable) {
                    props.handleSelectNode(id)
                  }
                }}
              >
                {text}
              </Typography>
            </div>
            {hover && (
              <div className={styles.actionButtons}>
                {/* If a folder, show Add folder option */}
                {droppable && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => props.handleSelectNode(id)}
                    >
                      <PreviewIcon
                        fontSize="small"
                        className={styles.actionButton}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => props.onAddFolder(id)}
                    >
                      <CreateNewFolderIcon
                        fontSize="small"
                        className={styles.actionButton}
                      />
                    </IconButton>
                  </>
                )}
                {/* Show Delete and Edit options */}
                <IconButton size="small" onClick={handleShowInput}>
                  <EditIcon fontSize="small" className={styles.actionButton} />
                </IconButton>
                <IconButton size="small" onClick={() => props.onDelete(id)}>
                  <Delete fontSize="small" className={styles.actionButton} />
                </IconButton>
              </div>
            )}
          </>
        )}
      </>
    </div>
  )
}
