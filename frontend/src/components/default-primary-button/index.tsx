import { Button } from '@mui/material'
import React from 'react'

interface PrimaryDefaulButtonProps {
  text: string
  type?: 'button' | 'submit' | 'reset'
}

const DefaultPrimaryButton: React.FC<PrimaryDefaulButtonProps> = ({
  text,
  type,
}) => {
  return (
    <Button variant="contained" color="primary" type={type}>
      {text}
    </Button>
  )
}

export default DefaultPrimaryButton
