import dayjs from 'dayjs'
import * as yup from 'yup'

export const addFamilyMemberSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().nullable(),
  zipCode: yup
    .string()
    .matches(/^\d{5}(\d{4})?$/, 'Invalid zip code format')
    .required('Zip code is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('is-valid-date', 'Date must be a valid format', (value) => dayjs(value, 'YYYY-MM-DD', true).isValid()),
})
