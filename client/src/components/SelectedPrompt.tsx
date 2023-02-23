import { NodeModel, CustomData } from '@/types'

interface Props {
  node: NodeModel<CustomData>
}

const SelectedPrompt = (props: Props) => {
  console.log(props.node)
  return (
    <div>
      <h1>SelectedPrompt</h1>
      <h2>{props.node.text}</h2>
      <p>{props.node.data?.body}</p>
    </div>
  )
}

export default SelectedPrompt
