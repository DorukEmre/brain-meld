import { NodeModel, CustomData } from '@/types'

interface Props {
  node: NodeModel<CustomData>
}

const SelectedPrompt = (props: Props) => {
  const { node } = props
  console.log(node)

  return (
    <div>
      <h1>{node.text}</h1>
      <p>{node.data?.body}</p>
    </div>
  )
}

export default SelectedPrompt
