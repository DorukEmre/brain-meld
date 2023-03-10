import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import IconButton from '@mui/material/IconButton'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import { ArrowRight, Delete } from '@mui/icons-material'
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
  onTextChange: (id: NodeModel['id'], value: string) => void
  onAddFolder: (id: NodeModel['id']) => void
  handleSelectNode: (id: NodeModel['id']) => void
}

export const CustomNode: React.FC<Props> = (props) => {
  // const { id, droppable, text, data } = props.node
  const { id, droppable, text } = props.node

  const [hover, setHover] = useState(false)
  const [visibleInput, setVisibleInput] = useState(false)
  const [labelText, setLabelText] = useState(text)

  const indent = props.depth * 24

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onToggle(id)
  }

  const handleShowInput = () => {
    setVisibleInput(true)
  }

  const handleCancel = () => {
    setLabelText(text)
    setVisibleInput(false)
    setHover(false)
  }

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value)
  }

  const handleSubmit = () => {
    setVisibleInput(false)
    props.onTextChange(id, labelText)
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
        <TypeIcon
          droppable={droppable ? droppable : false}
          // fileType={data?.fileType}
        />
      </div>

      <>
        {visibleInput ? (
          <div className={styles.inputWrapper}>
            <TextField
              className={`${styles.textField}
              ${styles.nodeInput}`}
              value={labelText}
              onChange={handleChangeText}
            />
            <IconButton
              className={styles.editButton}
              onClick={handleSubmit}
              disabled={labelText === ''}
            >
              <CheckIcon className={styles.editIcon} />
            </IconButton>
            <IconButton className={styles.editButton} onClick={handleCancel}>
              <CloseIcon className={styles.editIcon} />
            </IconButton>
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
              <div className={styles.actionButton}>
                {/* If a folder, show Add folder option */}
                {droppable && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => props.handleSelectNode(id)}
                    >
                      <PreviewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => props.onAddFolder(id)}
                    >
                      <CreateNewFolderIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
                {/* Show Delete and Edit options */}
                <IconButton size="small" onClick={handleShowInput}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => props.onDelete(id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            )}
          </>
        )}
      </>
    </div>
  )
}
