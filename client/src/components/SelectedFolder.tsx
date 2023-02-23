import { NodeModel, CustomData } from '@/types'

interface Props {
  node: NodeModel<CustomData>
}

const SelectedFolder = (props: Props) => {
  console.log(props.node)
  return (
    <div>
      <h1>SelectedFolder</h1>
      <h2>{props.node.text}</h2>
    </div>
  )
}

export default SelectedFolder
