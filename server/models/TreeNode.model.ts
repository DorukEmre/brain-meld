import mongoose from 'mongoose'

const TreeNodeSchema = new mongoose.Schema({
  id: { type: Number },
  parent: { type: Number },
  droppable: { type: Boolean },
  text: { type: String },
  data: { body: { type: String } },
})

export default mongoose.model('TreeNode', TreeNodeSchema)
