import * as Yup from 'yup'

export const operatorValidationSchema = Yup.object<ICreateOperatorFormValues>().shape({
  name: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  pointOfContactEmail: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required(),
  pointOfContactPhoneNumber: Yup.string(),
})

export const operatorInitialFormData: ICreateOperatorFormValues = {
  name: '',
  email: '',
  phone: '',
  zipCode: '',
  state: '',
  city: '',
  street: '',
  firstName: '',
  lastName: '',
  pointOfContactEmail: '',
  pointOfContactPhoneNumber: '',
}

export interface ICreateOperatorFormValues {
  name: string
  email: string
  phone: string
  zipCode: string
  state: string
  city: string
  street: string
  firstName: string
  lastName: string
  pointOfContactEmail: string
  pointOfContactPhoneNumber: string
}

export interface IFinishCreatingOperator extends ICreateOperatorFormValues {
  password: string
  confirmPassword: string
}

export const finishCreateOperatorValidationSchema = Yup.object<ICreateOperatorFormValues>().shape({
  name: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  pointOfContactEmail: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required(),
  pointOfContactPhoneNumber: Yup.string(),
  password: Yup.string().required('This field is required'),
  confirmPassword: Yup.string()
    .required('This field is required')
    .oneOf([Yup.ref('password'), ''], "Passwords don't match"),
  state: Yup.string().required(),
  city: Yup.string().required(),
  street: Yup.string().required(),
  phone: Yup.string().required(),
  email: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required(),
})

export const finishCreateOperatorFormData: IFinishCreatingOperator = {
  ...operatorInitialFormData,
  confirmPassword: '',
  password: '',
}

