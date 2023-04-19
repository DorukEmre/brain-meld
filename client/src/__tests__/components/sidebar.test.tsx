/* eslint-env jest */
import {
  fireEvent,
  getByText,
  queryByText,
  render,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import Sidebar from '@/components/Sidebar'

const treeData = [
  {
    id: 1,
    parent: 0,
    droppable: true,
    text: 'Folder 1',
  },
  {
    id: 2,
    parent: 0,
    droppable: false,
    text: 'Prompt 1',
    data: {
      body: 'This is some text',
    },
  },
  {
    id: 3,
    parent: 1,
    droppable: false,
    text: 'Prompt 1-1',
    data: {
      body: 'Prompt inside Folder 1',
    },
  },
]

const setTreeData = jest.fn()
const open = false
const setOpen = jest.fn()
const handleSubmitAddNode = jest.fn()
const handleSelectNode = jest.fn()
const nodeSelected = false
const isResponses = false
const handleNewChat = jest.fn()
const handlePreviousChat = jest.fn()
const handleDropNode = jest.fn()
const handlePromptTitleChange = jest.fn()
const handleDeletePrompt = jest.fn()

describe('Sidebar component', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <Sidebar
        treeData={treeData}
        setTreeData={setTreeData}
        open={open}
        setOpen={setOpen}
        handleSubmitAddNode={handleSubmitAddNode}
        handleSelectNode={handleSelectNode}
        nodeSelected={nodeSelected}
        isResponses={isResponses}
        handleNewChat={handleNewChat}
        handlePreviousChat={handlePreviousChat}
        handleDropNode={handleDropNode}
        handlePromptTitleChange={handlePromptTitleChange}
        handleDeletePrompt={handleDeletePrompt}
      />,
    )

    expect(getByTestId('sidebar')).toBeInTheDocument()
    expect(await screen.findByText('New chat')).toBeInTheDocument()
    expect(await screen.findByText('Add Folder')).toBeInTheDocument()
    expect(await screen.findByText('Folder 1')).toBeInTheDocument()
    expect(await screen.findByText('Prompt 1')).toBeInTheDocument()
    expect(screen.queryByText('Prompt 1-1')).toBeNull() // Inside Folder 1 so not visible on first load
  })
})
