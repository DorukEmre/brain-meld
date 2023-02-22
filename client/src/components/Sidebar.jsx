import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { ThemeProvider, CssBaseline } from '@mui/material'
import Button from '@mui/material/Button'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import {
  Tree,
  MultiBackend,
  DragLayerMonitorProps,
  getDescendants,
  getBackendOptions,
} from '@minoru/react-dnd-treeview'
import { NodeModel, CustomData } from '@/types'
import { CustomNode } from './tree/CustomNode'
import { CustomDragPreview } from './tree/CustomDragPreview'
import { AddDialog } from './tree/AddDialog'
import { theme } from './tree/theme'
import styles from '@/styles/Sidebar.module.css'

function Sidebar(props) {
  const [selectedFolderId, setSelectedFolderId] = useState(0)
  const handleDrop = (newTree) => props.setTreeData(newTree)

  const handleDelete = (id) => {
    const deleteIds = [
      id,
      ...getDescendants(props.treeData, id).map((node) => node.id),
    ]
    const newTree = props.treeData.filter(
      (node) => !deleteIds.includes(node.id),
    )

    props.setTreeData(newTree)
  }

  const handleOpenDialog = (node) => {
    console.log(node)
    setSelectedFolderId(node.id)
    props.setOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedFolderId(0)
    props.setOpen(false)
  }

  const handleTextChange = (id, value) => {
    const newTree = props.treeData.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          text: value,
        }
      }

      return node
    })

    props.setTreeData(newTree)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <nav className="tree-nav">
          <div className={styles.app}>
            <div>
              <Button
                onClick={handleOpenDialog}
                startIcon={<CreateNewFolderIcon />}
              >
                Add Folder
              </Button>
              {props.open && (
                <AddDialog
                  tree={props.treeData}
                  onClose={handleCloseDialog}
                  onSubmit={props.handleSubmitAddNode}
                  droppable={true}
                  selectedFolderId={selectedFolderId}
                />
              )}
            </div>
            <Tree
              tree={props.treeData}
              rootId={0}
              render={(node, options) => (
                <CustomNode
                  node={node}
                  {...options}
                  onDelete={handleDelete}
                  onAddFolder={() => handleOpenDialog(node)}
                  onTextChange={handleTextChange}
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
  )
}

export default Sidebar
