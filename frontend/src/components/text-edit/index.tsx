import { TextField } from '@mui/material'
import React from 'react'
import styles from './index.module.css'

interface TextEditProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TextEdit: React.FC<TextEditProps> = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      margin="normal"
      size="medium"
      className={styles.field}
      value={value}
      onChange={onChange}
    />
  )
}

export default TextEdit
