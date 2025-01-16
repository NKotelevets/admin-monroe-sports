import { FormikHelpers } from 'formik'
import { useEffect, useState } from 'react'
import { useNotification } from '@/hooks/useNotification.ts'

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please, try again!'

interface TErrorReason<T> {
  data: {
    code?: string
    details?: T | string[] | string
    error?: string[] | string
    message?: string[] | string
  }
}

export const useFieldErrors = <T extends object, >() => {
  const [nonFieldErrors, setNonFieldErrors] = useState<string[] | string | undefined>(undefined)
  const { notify } = useNotification()

  useEffect(() => {
    if (!nonFieldErrors) return
    const errorMessage = Array.isArray(nonFieldErrors) ? nonFieldErrors : [nonFieldErrors]

    notify(errorMessage.join(', '), 'error')
  }, [nonFieldErrors])

  const handleErrors = (setErrors: FormikHelpers<T>['setErrors'], callback?: () => void) => {
    return ({ data: reason }: TErrorReason<T>) => {

      if (!reason?.code && !reason?.message && !reason?.details && !reason?.error) {
        throw reason
      }

      if (reason?.code === 'invalid_input' && typeof reason?.details === 'object' && Object.keys(reason.details as T).length) {
        setErrors && setErrors(reason.details as T)
      }

      if (reason?.code === 'invalid_input' && Array.isArray(reason?.details) && reason?.details.length) {
        setNonFieldErrors(reason.details)
      }

      // if, for some reason, there is no field errors we
      // show the error message itself
      if (!reason?.code || reason?.code !== 'invalid_input') {
        setNonFieldErrors(reason?.message || reason?.details as string || reason?.error || DEFAULT_ERROR_MESSAGE)
      }

      callback && callback()
    }
  }

  return {
    handleErrors,
    nonFieldErrors
  }
}
