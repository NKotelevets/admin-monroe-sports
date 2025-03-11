import * as yup from 'yup'

export const confirmUserDataSchema = yup.object().shape({
  terms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.number().required('Gender is required'),
  zipCode: yup.string()
    .matches(/^\d{5}(\d{4})?$/, 'Invalid ZIP code format')
    .required('Zip code is required'),
})
