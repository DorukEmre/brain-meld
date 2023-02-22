import { useState } from 'react'

import Sidebar from '@/components/Sidebar'
import Conversation from '@/components/Conversation'

import SampleData from '@/sample-data.json'
import { NodeModel, CustomData } from '@/types'

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
  const [openAddFolderModal, setOpenAddFolderModal] = useState(false)
  const [openAddFileModal, setOpenAddFileModal] = useState(false)

  const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>(SampleData)

  const handleSubmitAddNode = (newNode: Omit<NodeModel<CustomData>, 'id'>) => {
    const lastId = getLastId(treeData) + 1

    setTreeData([
      ...treeData,
      {
        ...newNode,
        id: lastId,
      },
    ])

    setOpenAddFolderModal(false)
    setOpenAddFileModal(false)
  }

  let componentProps = {
    treeData,
    setTreeData,
    handleSubmitAddNode,

    // ownProfile: props.ownProfile ? props.ownProfile : false,
  }
  return (
    <>
      <Sidebar
        open={openAddFolderModal}
        setOpen={setOpenAddFolderModal}
        {...componentProps}
      />
      <Conversation
        open={openAddFileModal}
        setOpen={setOpenAddFileModal}
        {...componentProps}
      />
    </>
  )
}

export default Main
