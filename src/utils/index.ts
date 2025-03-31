import { format, parse } from 'date-fns'
import { SorterResult, SortOrder } from 'antd/es/table/interface'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const validateNumber = (value: string) => /^[0-9]+$/.test(value) || value === ''

export const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

/**
 * Formats a date without tz
 * @param date string format: 1990-01-01
 * @returns Jan, 01 1990
 */
export const formatWithoutTZ = (date: string) => format(parse(date, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy')

/**
 * Formats phone number using the USA format
 * @param phoneNumber
 */
export const formatPhoneNumber = (phoneNumber: string | number) => {
  const phone = `${phoneNumber}`.replace(/\D/g, '')

  if (phone.length == 10) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }

  return phoneNumber
}

/**
 * Helps determine the sort order for column in a Table component.
 *
 * @param {string} sortParam - Column name to check if it is present on current ordering.
 *
 * @param {string} ordering - A string indicating the current sort state.
 *                            If it contains the column name, the function returns either 'ascend' or 'descend'
 *                            based on whether the string starts with a '-' (descending).
 *                            If the ordering does not include column name, the function returns null.
 *
 * @returns {string|null} - 'ascend' if sorting in ascending order, 'descend' if descending,
 *                          or null if no sorting is applied to the column.
 */
export const getColumnSort = (sortParam: string, ordering: string | null): SortOrder | undefined => {
  if (ordering === sortParam || ordering === `-${sortParam}`) {
    return ordering.startsWith('-') ? 'descend' : 'ascend'
  }
  return undefined
}

/**
 * Type guard function to check if an error is of type FetchBaseQueryError,
 * with an optional generic type for the `data` property.
 *
 * @template T - The expected type of the `data` property in FetchBaseQueryError.
 * @param error - The error object to check, which may be of any type.
 * @returns A boolean indicating whether the error is a FetchBaseQueryError.
 *
 * @example
 * if (isFetchBaseQueryError<{ exists: any[] new: any }>(error)) {
 *   console.log(error.data.exists[0]) // `data` is now strongly typed
 * }
 */
export function isFetchBaseQueryError<T = unknown>(error: unknown): error is FetchBaseQueryError & { data: T } {
  return typeof error === 'object' && error != null && 'data' in error
}


const toCamelCase = (key: string): string =>
  key
    .replace(/_./g, (match) => match.charAt(1).toUpperCase())
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, '')
/**
 * Transforms the keys of an object or array from snake_case to camelCase.
 *
 * This function recursively traverses the input object or array and converts
 * all keys to camelCase. It also handles nested objects and arrays, ensuring
 * that all keys at all levels are transformed. If the input is null, it returns
 * null. The function is type-safe and avoids the use of `any`, ensuring that
 * only valid objects or arrays are processed.
 *
 * @param obj - The object or array to transform. Can be null, an object,
 *              or an array of objects.
 * @returns A new object or array with keys transformed to camelCase.
 *          If the input is null, returns null.
 */
export const transformKeysToCamelCase = <T, K>(obj: K): T => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysToCamelCase(item)) as T
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key)

      // Ensure obj[key] is defined and transform recursively if it's an object
      const value = (obj as Record<string, unknown>)[key]
      acc[camelCaseKey] = value && typeof value === 'object'
        ? transformKeysToCamelCase(value)
        : value

      return acc
    }, {} as Record<string, unknown>) as T
  }

  // Return obj as-is if it's not an array or object
  return obj as unknown as T
}

/**
 * Recursively transforms the keys of an object or array from camelCase to snake_case.
 *
 * @template T - The expected output type.
 * @template K - The input object or array type.
 *
 * @param {K} obj - The input object or array with camelCase keys to be transformed.
 *
 * @returns {T} A new object or array with all keys converted to snake_case.
 */
export const transformKeysToSnakeCase = <T, K>(obj: K): T => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysToSnakeCase(item)) as T
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeCaseKey = toSnakeCase(key)

      const value = (obj as Record<string, unknown>)[key]
      acc[snakeCaseKey] = value && typeof value === 'object'
        ? transformKeysToSnakeCase(value)
        : value

      return acc
    }, {} as Record<string, unknown>) as T
  }

  return obj as unknown as T
}

// Helper function to convert camelCase to snake_case
const toSnakeCase = (str: string): string =>
  str.replace(/([A-Z])/g, '_$1').toLowerCase()


export const getTableSortField = <T,>(sorter:  SorterResult<T> | SorterResult<T>[], fieldMap: { [key: string]: string }) => {
  if (Array.isArray(sorter) || !sorter.order) return undefined
  const getField = (field: string): string => {
    if (field in fieldMap) return fieldMap[field]
    return field
  }

  const field = getField(sorter.field as string)
  return sorter.order === 'descend' ? `-${field}` : field
}
