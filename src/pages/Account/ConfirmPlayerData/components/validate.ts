import * as yup from 'yup'

export const confirmPlayerDataSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  suffix: yup.string().notRequired(),
  email: yup.string().email('Invalid email').notRequired(),
})
