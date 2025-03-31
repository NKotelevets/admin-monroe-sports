import { useNotification } from '@/hooks/useNotification.ts'

export const useCopyContent = () => {
  const { notify } = useNotification()

  const copy = async (content: string, successMessage?: string) => {
    await navigator.clipboard.writeText(content)
    !!successMessage && notify(successMessage, 'success')
  }

  return {
    copy
  }
}
