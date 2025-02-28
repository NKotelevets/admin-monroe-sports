import * as yup from 'yup'

export const createPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('Password is required')
    .matches(/.{8,}/, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Password is required')
    .matches(/.{8,}/, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})
