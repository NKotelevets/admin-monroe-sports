import { format, isValid, parse, parseISO } from 'date-fns'
import { SorterResult, SortOrder } from 'antd/es/table/interface'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import dayjs from 'dayjs'

export const validateNumber = (value: string) => /^[0-9]+$/.test(value) || value === ''

export const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

type ParseWithFormatsOptions = {
  fallbackToISO?: boolean
  referenceDate?: Date
}

/**
 * Parses a date string using multiple formats until a valid date is found.
 * Optionally, falls back to ISO date parsing if none of the provided formats match.
 *
 * @param dateString - The input date string to parse.
 * @param formats - An array of date format strings to attempt parsing with.
 *                  Format strings should follow the `date-fns` formatting tokens.
 * @param options - Optional configuration for parsing:
 *   - `fallbackToISO`: Whether to attempt ISO date parsing as a fallback. Default is `true`.
 *   - `referenceDate`: The reference date used when parsing dates without full components
 *                      (e.g., missing time or timezone). Default is the current date.
 * @returns The parsed `Date` object if a valid format is found, or `null` if parsing fails.
 *
 * @throws This function does not throw errors. Instead, it returns `null` for invalid dates.
 *
 * @example
 * ```typescript
 * const dateStr = '12/09/2024'
 * const formats = ['MM/dd/yyyy', 'dd-MM-yyyy']
 *
 * const parsedDate = parseWithMultipleFormats(dateStr, formats)
 * console.log(parsedDate) // Output: Date object representing the parsed date
 *
 * const invalidDate = parseWithMultipleFormats('invalid', formats)
 * console.log(invalidDate) // Output: null
 * ```
 */
export const parseWithMultipleFormats = (
  dateString: string,
  formats: string[],
  options: ParseWithFormatsOptions = {}
): Date | null => {
  const { fallbackToISO = true, referenceDate = new Date() } = options

  for (const format of formats) {
    const parsedDate = parse(dateString, format, referenceDate)
    if (isValid(parsedDate)) {
      return parsedDate
    }
  }

  if (fallbackToISO) {
    const isoParsedDate = parseISO(dateString)
    if (isValid(isoParsedDate)) {
      return isoParsedDate
    }
  }

  return null
}

/**
 * Formats a date without tz
 * @param date string format: 1990-01-01
 * @returns Jan, 01 1990 | -
 */
export const formatWithoutTZ = (date: string) => {
  const parsedDate = parseWithMultipleFormats(date, ['yyyy-MM-dd', 'MM/dd/yyyy', 'M/d/yyyy', 'M/d/yyyy'])

  if (!parsedDate) return '-'

  return format(parsedDate, 'MMM d, yyyy')
}

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
export const getColumnSort = (sortParam: string, ordering?: string | null): SortOrder | undefined => {
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

export const checkAmOrPm = (time: string) => {
  const hour = dayjs(time, 'HH:mm').hour() // Extract the hour
  return hour < 12 ? 'AM' : 'PM'
}

/**
 * Removes properties with empty string (`""`) values from an object.
 *
 * This function takes an object as input and returns a new object where
 * all properties with empty string (`""`) values are removed. It preserves
 * the original types of the object's properties.
 *
 * @template T - The type of the input object.
 * @param {T} obj - The input object from which empty string properties should be removed.
 * @returns {{ [K in keyof T]: Exclude<T[K], ""> }} A new object without empty string values.
 *
 * @example
 * const obj = { a: 1, b: "", c: "test", d: "" }
 * const cleanedObj = removeEmptyStringAttributes(obj)
 * console.log(cleanedObj) // Output: { a: 1, c: "test" }
 */
export const removeEmptyStringAttributes = <T extends object>(obj: T): {
  [K in keyof T]: Exclude<T[K], ''>
} => {
  const result: Partial<{ [K in keyof T]: Exclude<T[K], ''> }> = {}

  for (const key of Object.keys(obj) as Array<keyof T>) {
    if (obj[key] !== '') {
      result[key] = obj[key] as Exclude<T[typeof key], ''>
    }
  }

  return result as { [K in keyof T]: Exclude<T[K], ''> }
}

export const scrollToTop = () => {
  const scrollableElement = document.querySelector('.ant-layout-content div')

  if (scrollableElement) {
    scrollableElement.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to the top
  }
}
