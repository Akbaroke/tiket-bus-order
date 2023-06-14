import { toast } from 'react-hot-toast'

export const notifySuccess = (
  message: string,
  id: string
) => toast.success(message, { id })

export const notifyError = (message: string, id: string) =>
  toast.error(message, { id })

export const notifyLoading = (
  message: string,
  id: string
) => toast.loading(message, { id })
