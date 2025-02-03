import * as yup from 'yup'

export const signUpSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  terms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  zipCode: yup.string()
    .matches(/^\d{5}(\d{4})?$/, 'Invalid ZIP code format')
    .required('Zip code is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(/.{8,}/, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .matches(/.{8,}/, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})
