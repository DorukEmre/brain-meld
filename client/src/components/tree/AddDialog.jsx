import React, { useState } from 'react'
import {
  Button,
  Select,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import styles from './styles/AddDialog.module.css'

export const AddDialog = (props) => {
  const [text, setText] = useState('')
  const [parent, setParent] = useState(props.selectedFolderId | 0)

  const handleChangeText = (e) => {
    setText(e.target.value)
  }

  const handleChangeParent = (e) => {
    console.log(e.target.value)
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
              data: {
                fileType: 'text',
              },
            })
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
