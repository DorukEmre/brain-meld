import { NodeModel, CustomData } from '@/types'

interface Props {
  node: NodeModel<CustomData>
  treeData: NodeModel<CustomData>[]
}

const SelectedFolder = (props: Props) => {
  const { node, treeData } = props
  console.log(node)

  // Filter children of this node that are not folders
  const children = treeData.filter(
    (treenode) => treenode.parent === node.id && !treenode.droppable,
  )
  console.log(children)

  return (
    <div>
      <h1>{props.node.text}</h1>
      {children.map((child) => (
        <div key={child.id}>
          <h2>{child.text}</h2>
          <p>{child.data?.body}</p>
        </div>
      ))}
    </div>
  )
}

export default SelectedFolder
