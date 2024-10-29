import { format, parse } from 'date-fns'
import { SortOrder } from 'antd/es/table/interface'

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
