import { useToast } from 'primevue/usetoast'
import type { ToastMessageOptions } from 'primevue/toast'

export function useToastService() {
  const toast = useToast()

  function success(config: Pick<ToastMessageOptions, 'summary' | 'detail'>) {
    toast.add({ ...config, severity: 'success', life: 3000, closable: true })
  }

  function error(config: Pick<ToastMessageOptions, 'summary' | 'detail'>) {
    toast.add({ ...config, severity: 'error', life: 3000, closable: true })
  }

  return { success, error }
}
