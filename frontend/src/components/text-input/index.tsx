import { TextField } from '@mui/material'
import React from 'react'
import styles from './index.module.css'

interface TextInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
  multiline?: boolean
  rows?: number
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  multiline,
  rows,
}) => {
  return (
    <TextField
      label={label}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      size="medium"
      className={styles.field}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
    />
  )
}

export default TextInput
