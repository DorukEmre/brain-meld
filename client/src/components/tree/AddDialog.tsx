import React, { useState } from 'react'

import {
  Button,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material'
import { NodeModel } from '@/types'
import styles from './styles/AddDialog.module.css'

type Props = {
  tree: NodeModel[]
  onClose: () => void
  onSubmit: (e: Omit<NodeModel, 'id'>) => void
  selectedFolderId?: number
  selectedResponse?: {
    response: string
    index: number
  }
  droppable: boolean | undefined
}

export const AddDialog: React.FC<Props> = (props) => {
  const [text, setText] = useState('')
  const [parent, setParent] = useState(props.selectedFolderId || 0)

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleChangeParent = (e: SelectChangeEvent<number>) => {
    setParent(Number(e.target.value))
  }

  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>
        {props.droppable ? 'Add New Folder' : 'Save Prompt'}
      </DialogTitle>
      <DialogContent className={styles.content}>
        <div>
          <TextField label="Name" onChange={handleChangeText} value={text} />
        </div>
        <div>
          <FormControl className={styles.select}>
            <InputLabel>Location</InputLabel>
            <Select
              label="Location"
              onChange={handleChangeParent}
              value={parent}
            >
              <MenuItem value={0}>(root)</MenuItem>
              {props.tree
                .filter((node) => node.droppable === true)
                .map((node) => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.text}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          disabled={text === ''}
          onClick={() =>
            props.onSubmit({
              text,
              parent,
              droppable: props.droppable,
              data: { body: props.selectedResponse?.response },
              // data: { fileType: 'text' },
            })
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
