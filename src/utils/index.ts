export const validateNumber = (value: string) => /^[0-9]+$/.test(value) || value === ''

export const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

