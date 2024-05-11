import type { ToastMessageOptions } from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

export function useToastService() {
  const toast = useToast()
  const baseConfig: ToastMessageOptions = { life: 3000, closable: true }
  function normalizeOption(config: ToastMessageOptions | string): ToastMessageOptions {
    if (typeof config === "string") return { ...baseConfig, detail: config }
    return { ...baseConfig, ...config, }
  }

  function success(config: ToastMessageOptions) {
    toast.add({ ...normalizeOption(config), severity: 'success' })
  }

  function error(config: ToastMessageOptions | string) {
    toast.add({ ...normalizeOption(config), severity: 'error' })
  }

  return { success, error }
}
