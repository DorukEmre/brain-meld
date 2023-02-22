import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { ArrowRight, Delete, FileCopy } from '@mui/icons-material'
import { useDragOver } from '@minoru/react-dnd-treeview'
import { NodeModel, CustomData } from '@/types'
import { TypeIcon } from './TypeIcon'
import styles from './styles/CustomNode.module.css'

export const CustomNode = (props) => {
  const [hover, setHover] = useState(false)
  const { id, droppable, data } = props.node
  const indent = props.depth * 24

  const handleToggle = (e) => {
    e.stopPropagation()
    props.onToggle(props.node.id)
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
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRight />
          </div>
        )}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div className={styles.labelGridItem}>
        <Typography variant="body2">{props.node.text}</Typography>
      </div>
      {props.node.droppable && hover && (
        <>
          <div className={styles.actionButton}>
            <IconButton size="small" onClick={() => props.onAddFolder(id)}>
              <CreateNewFolderIcon fontSize="small" />
            </IconButton>
          </div>
        </>
      )}
      {hover && (
        <>
          <div className={styles.actionButton}>
            <IconButton size="small" onClick={() => props.onDelete(id)}>
              <Delete fontSize="small" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  )
}
