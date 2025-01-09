import * as Yup from 'yup'
import { ILocation } from '@/common/interfaces/location.ts'

export const locationFormValidateSchema = Yup.object<ILocation>().shape({
  name: Yup.string().required('Location name is required'),
  address: Yup.string().required('Address is required'),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('Zip code is required'),
  state: Yup.string()
    .max(2, 'Use the state code')
    .required('State is required'),
  city: Yup.string().required('City is required')
})
