import React, { useState, Dispatch, SetStateAction } from 'react'
import { DndProvider } from 'react-dnd'
import { ThemeProvider, CssBaseline } from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import RestoreIcon from '@mui/icons-material/Restore'
import AddIcon from '@mui/icons-material/Add'

import {
  Tree,
  MultiBackend,
  getBackendOptions,
  DropOptions,
} from '@minoru/react-dnd-treeview'

import { NodeModel, CustomData } from '@/types'
import { CustomNode } from './tree/CustomNode'
import { CustomDragPreview } from './tree/CustomDragPreview'
import { AddDialog } from './tree/AddDialog'
import { theme } from './tree/theme'

import styles from '@/styles/Sidebar.module.css'

import { useMutation } from '@apollo/client'
import { DELETE_TREENODE, UPDATE_TREENODE } from '@/graphql/treeMutations'
import { GET_TREENODES } from '@/graphql/treeQueries'

interface Props {
  treeData: NodeModel<CustomData>[]
  setTreeData: Dispatch<SetStateAction<NodeModel<CustomData>[]>>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleSubmitAddNode: (newNode: Omit<NodeModel<CustomData>, 'id'>) => void
  handleSelectNode: (id: NodeModel['id']) => void
  nodeSelected: boolean
  isResponses: boolean
  handleNewChat: () => void
  handlePreviousChat: () => void
}

function Sidebar(props: Props) {
  const [selectedFolderId, setSelectedFolderId] = useState(0)

  const [updateTreeNode] = useMutation(UPDATE_TREENODE, {
    refetchQueries: [{ query: GET_TREENODES }],
  })

  const [deleteTreeNode] = useMutation(DELETE_TREENODE, {
    refetchQueries: [{ query: GET_TREENODES }],
  })

  const handleDrop = (
    newTree: NodeModel<CustomData>[],
    options: DropOptions<CustomData>,
  ) => {
    const node = props.treeData.find((node) => node.id === options.dragSourceId)

    if (node) {
      updateTreeNode({
        variables: {
          id: node.id,
          parent: options.dropTargetId,
          text: node.text,
        },
      })
    }
  }

  const handleTextChange = (id: NodeModel['id'], value: string) => {
    const node = props.treeData.find((node) => node.id === id)

    if (node) {
      updateTreeNode({
        variables: {
          id,
          parent: node.parent,
          text: value,
        },
      })
    }
  }

  const handleDelete = (id: NodeModel['id']) => {
    deleteTreeNode({
      variables: {
        id,
      },
    })
  }

  const handleOpenDialog = (nodeId: number) => {
    setSelectedFolderId(nodeId)
    props.setOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedFolderId(0)
    props.setOpen(false)
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <nav className="tree-nav">
            <div className={styles.app}>
              <div className={styles.handleChatBar}>
                <button
                  onClick={props.handleNewChat}
                  className={styles.handleChatBarButton}
                >
                  <AddIcon />
                  <span>New chat</span>
                </button>
                {props.nodeSelected && props.isResponses && (
                  <button
                    onClick={props.handlePreviousChat}
                    className={styles.handleChatBarButton}
                  >
                    <RestoreIcon />
                    <span>Previous chat</span>
                  </button>
                )}
              </div>
              <>
                <button
                  className={styles.addFolderButton}
                  onClick={() => handleOpenDialog(0)}
                  // startIcon={<CreateNewFolderIcon />}
                >
                  <CreateNewFolderIcon />
                  Add Folder
                </button>
                {props.open && (
                  <AddDialog
                    tree={props.treeData}
                    onClose={handleCloseDialog}
                    // @ts-ignore
                    onSubmit={props.handleSubmitAddNode}
                    droppable={true}
                    selectedFolderId={selectedFolderId}
                  />
                )}
              </>
              <Tree
                tree={props.treeData}
                rootId={0}
                render={(node, options) => (
                  <CustomNode
                    node={node}
                    {...options}
                    onDelete={handleDelete}
                    onAddFolder={() => handleOpenDialog(Number(node.id))}
                    onTextChange={handleTextChange}
                    handleSelectNode={() => props.handleSelectNode(node.id)}
                  />
                )}
                dragPreviewRender={(monitorProps) => (
                  <CustomDragPreview monitorProps={monitorProps} />
                )}
                onDrop={handleDrop}
                classes={{
                  root: styles.treeRoot,
                  draggingSource: styles.draggingSource,
                  dropTarget: styles.dropTarget,
                  listItem: styles.li,
                  container: styles.ul,
                }}
              />
            </div>
          </nav>
        </DndProvider>
      </ThemeProvider>
    </>
  )
}

export default Sidebar
