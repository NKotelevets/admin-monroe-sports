import { format, parse } from 'date-fns'

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
