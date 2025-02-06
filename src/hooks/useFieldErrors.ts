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

/**
 * A custom hook to manage and handle field errors with optional error notifications.
 *
 * @template T - A generic type parameter extending an object.
 * @param {boolean} [showNotification] - A flag to determine whether to show error notifications. Defaults to false.
 * @returns {{
 *   handleErrors: (setErrors: FormikHelpers<T>['setErrors'], callback?: () => void) => (params: { data: TErrorReason<T> }) => void,
 *   nonFieldErrors: string[] | string | undefined
 * }} An object containing the `handleErrors` function for managing errors and `nonFieldErrors` for non-field-specific error messages.
 */
export const useFieldErrors = <T extends object>(showNotification?: boolean) => {
  const [nonFieldErrors, setNonFieldErrors] = useState<string[] | string | undefined>(undefined)
  const { notify } = useNotification()

  /**
   * Displays a notification with error messages if applicable.
   *
   * Checks if `nonFieldErrors` exists and `showNotification` is true.
   * If valid, converts `nonFieldErrors` into an array (if not already),
   * joins the error messages with a comma, and triggers the `notify` function
   * with the combined error message and 'error' type.
   *
   * @param {Array|string} nonFieldErrors - The non-field error message(s) to display.
   * @param {boolean} showNotification - Flag indicating whether to show the notification.
   * @param {Function} notify - Callback function for displaying notifications.
   */
  useEffect(() => {
    if (!nonFieldErrors || showNotification === false) return
    const errorMessage = Array.isArray(nonFieldErrors) ? nonFieldErrors : [nonFieldErrors]

    notify(errorMessage.join(', '), 'error')
  }, [nonFieldErrors, showNotification])

  /**
   * Handles form submission errors by processing error details and updating state variables accordingly.
   *
   * @template T - The type of the form data.
   * @param {FormikHelpers<T>['setErrors']} setErrors - Function to set field-level errors in the form.
   * @param {Function} [callback] - Optional callback function to be executed after handling errors.
   * @returns {Function} A function that takes an error reason object and processes the error.
   */
  const handleErrors = (setErrors: FormikHelpers<T>['setErrors'], callback?: () => void) => {
    return ({ data: reason }: TErrorReason<T>) => {
      if (!reason?.code && !reason?.message && !reason?.details && !reason?.error) {
        throw reason
      }

      setNonFieldErrors(undefined)
      if (
        reason?.code === 'invalid_input' &&
        typeof reason?.details === 'object' &&
        Object.keys(reason.details as T).length
      ) {
        setErrors && setErrors(reason.details as T)
      }

      if (reason?.code === 'invalid_input' && Array.isArray(reason?.details) && reason?.details.length) {
        setNonFieldErrors(reason.details)
      }

      // if, for some reason, there is no field errors we
      // show the error message itself
      if (!reason?.code || reason?.code !== 'invalid_input') {
        setNonFieldErrors(reason?.message || (reason?.details as string) || reason?.error || DEFAULT_ERROR_MESSAGE)
      }

      callback && callback()
    }
  }

  return {
    handleErrors,
    nonFieldErrors,
  }
}
