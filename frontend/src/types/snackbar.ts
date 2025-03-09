export interface CustomizedSnackBarProps {
  message: string
  open: boolean
  autoHideDuration?: number
  severity?: 'success' | 'error' | 'warning' | 'info'
}
