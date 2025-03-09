import Alert from '@mui/material/Alert'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'

interface CustomizedSnackBarProps {
  message: string
  open: boolean
  autoHideDuration?: number
  severity?: 'success' | 'error' | 'warning' | 'info'
}

const CustomizedSnackBar: React.FC<CustomizedSnackBarProps> = ({
  message,
  open,
  autoHideDuration = 3000,
  severity,
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    open = false
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default CustomizedSnackBar
