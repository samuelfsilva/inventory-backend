import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import React from 'react'
import styles from './index.module.css'

interface DialogWindowProps {
  title: string
  openDialog: boolean
  handleCloseDialog: () => void
  handleConfirm: (event: React.FormEvent) => void
  children?: React.ReactNode
}

const DialogWindow: React.FC<DialogWindowProps> = ({
  title,
  openDialog,
  handleCloseDialog,
  handleConfirm,
  children,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={styles.title} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <div className={styles.form}>{children}</div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleCloseDialog} autoFocus>
          Cancel
        </Button>
        <Button color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogWindow
