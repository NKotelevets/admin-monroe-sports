import { useEffect, useState } from 'react'

export const useFormSummary = (isOpened: boolean) => {
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    if (!isOpened) {
      const delay = setTimeout(() => {
        setShowForm(false)
      }, 200)

      return () => clearTimeout(delay)
    }
  }, [isOpened])

  return {
    showForm,
    setShowForm
  }
}
