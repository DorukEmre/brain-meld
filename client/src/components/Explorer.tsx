import { useState, useEffect } from 'react'
import { ChatCompletionRequestMessage } from 'openai'

import Sidebar from '@/components/Sidebar'
import Conversation from '@/components/Conversation'

import { NodeModel, CustomData } from '@/types'
import { useMutation, useQuery } from '@apollo/client'
import { GET_TREENODES } from '@/graphql/treeQueries'
import {
  ADD_TREENODE,
  DELETE_TREENODE,
  UPDATE_TREENODE,
} from '@/graphql/treeMutations'

import { DropOptions } from '@minoru/react-dnd-treeview'

import SelectedPrompt from './SelectedPrompt'
import SelectedFolder from './SelectedFolder'

const getLastId = (treeData: NodeModel[]) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1
    } else if (a.id > b.id) {
      return -1
    }

    return 0
  })

  if (reversedArray.length > 0) {
    return reversedArray[0].id
  }

  return 0
}

const Explorer = () => {
  const [responses, setResponses] = useState<ChatCompletionRequestMessage[]>([])
  const [node, setNode] = useState<NodeModel<CustomData>>({
    id: 1,
    parent: 0,
    droppable: false,
    text: '',
  })
  const [nodeSelected, setNodeSelected] = useState(false)
  const [openAddFolderModal, setOpenAddFolderModal] = useState(false)
  const [openAddFileModal, setOpenAddFileModal] = useState(false)

  const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>([])

  const { loading, error, data } = useQuery(GET_TREENODES)

  useEffect(() => {
    if (data) {
      setTreeData(data.allTreeNodes)
    }
  }, [data])

  const [addTreeNode] = useMutation(ADD_TREENODE, {
    refetchQueries: [{ query: GET_TREENODES }],
  })
  const [updateTreeNode] = useMutation(UPDATE_TREENODE, {
    refetchQueries: [{ query: GET_TREENODES }],
  })
  const [deleteTreeNode] = useMutation(DELETE_TREENODE, {
    refetchQueries: [{ query: GET_TREENODES }],
  })

  // Create new entry/node (folder or file)
  const handleSubmitAddNode = (newNode: Omit<NodeModel<CustomData>, 'id'>) => {
    const nextId = Number(getLastId(treeData)) + 1

    addTreeNode({
      variables: {
        id: nextId,
        parent: newNode.parent,
        droppable: newNode.droppable,
        text: newNode.text,
        body: newNode.data?.body,
      },
    })

    setOpenAddFolderModal(false)
    setOpenAddFileModal(false)
  }

  // Update when a node is dropped in the sidebar
  const handleDropNode = (
    newTree: NodeModel<CustomData>[],
    options: DropOptions<CustomData>,
  ) => {
    const targetNode = treeData.find((node) => node.id === options.dragSourceId)

    if (targetNode) {
      updateTreeNode({
        variables: {
          id: targetNode.id,
          parent: options.dropTargetId,
          text: targetNode.text,
        },
      })
    }
  }

  // Update when a node/prompt title is changed
  const handlePromptTitleChange = (id: NodeModel['id'], value: string) => {
    const targetNode = treeData.find((node) => node.id === id)

    if (targetNode) {
      updateTreeNode({
        variables: {
          id,
          parent: targetNode.parent,
          text: value,
          body: targetNode.data?.body,
        },
      })
    }
  }

  // Update when a node/prompt body content is changed
  const handlePromptBodyChange = (id: NodeModel['id'], value: string) => {
    const targetNode = treeData.find((node) => node.id === id)

    if (targetNode) {
      updateTreeNode({
        variables: {
          id,
          parent: targetNode.parent,
          text: targetNode.text,
          body: value,
        },
      })
    }
  }

  // Delete node/prompt
  const handleDeletePrompt = (id: NodeModel['id']) => {
    const targetNode = treeData.find((node) => node.id === id)

    if (targetNode) {
      deleteTreeNode({
        variables: {
          id,
        },
      })

      // If a node/prompt is displayed and the deleted node is the displayed node, stop displaying node
      if (nodeSelected && node.id === targetNode.id) setNodeSelected(false)
    }
  }

  // Select node/prompt in sidebar
  const handleSelectNode = (id: NodeModel['id']) => {
    const targetNode = treeData.find((node) => node.id === id)

    setNode(targetNode!)
    setNodeSelected(true)
  }

  // Start new chat
  const handleNewChat = () => {
    setNodeSelected(false)
    setResponses([])
  }

  // Restore previous chat
  const handlePreviousChat = () => {
    setNodeSelected(false)
  }

  let componentProps = {
    treeData,
    setTreeData,
    handleSubmitAddNode,
  }

  return (
    <>
      {loading || error ? (
        <p>{loading ? 'Loading' : 'Error'}...</p>
      ) : (
        <>
          <Sidebar
            open={openAddFolderModal}
            setOpen={setOpenAddFolderModal}
            handleSelectNode={handleSelectNode}
            nodeSelected={nodeSelected}
            isResponses={responses.length > 0}
            handleNewChat={handleNewChat}
            handlePreviousChat={handlePreviousChat}
            handleDropNode={handleDropNode}
            handlePromptTitleChange={handlePromptTitleChange}
            handleDeletePrompt={handleDeletePrompt}
            {...componentProps}
          />
          {nodeSelected ? (
            node.droppable ? (
              <SelectedFolder node={node} treeData={treeData} />
            ) : (
              <SelectedPrompt
                node={node}
                handlePromptTitleChange={handlePromptTitleChange}
                handlePromptBodyChange={handlePromptBodyChange}
                handleDeletePrompt={handleDeletePrompt}
              />
            )
          ) : (
            <Conversation
              open={openAddFileModal}
              setOpen={setOpenAddFileModal}
              responses={responses}
              setResponses={setResponses}
              {...componentProps}
            />
          )}
        </>
      )}
    </>
  )
}

export default Explorer
