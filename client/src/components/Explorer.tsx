import { useState, useEffect } from 'react'
import { ChatCompletionRequestMessage } from 'openai'

import Sidebar from '@/components/Sidebar'
import Conversation from '@/components/Conversation'

import { NodeModel, CustomData } from '@/types'
import { useMutation, useQuery } from '@apollo/client'
import { GET_TREENODES } from '@/graphql/treeQueries'
import { ADD_TREENODE } from '@/graphql/treeMutations'
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

const Main = () => {
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

  const handleSelectNode = (id: NodeModel['id']) => {
    const node = treeData.find((node) => node.id === id)

    setNode(node!)
    setNodeSelected(true)
  }

  const handleNewChat = () => {
    setNodeSelected(false)
    setResponses([])
  }

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
            {...componentProps}
          />
          {nodeSelected ? (
            node.droppable ? (
              <SelectedFolder node={node} treeData={treeData} />
            ) : (
              <SelectedPrompt node={node} />
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

export default Main
