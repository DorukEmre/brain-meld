export type CustomData = {
  // fileType: string
  body: string
}

export type NodeModel<T = unknown> = {
  id: number | string
  parent: number | string
  droppable?: boolean
  text: string
  data?: T
}
