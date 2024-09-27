import * as Yup from 'yup'

export const operatorValidationSchema = Yup.object<ICreateOperatorFormValues>({
  name: Yup.string().required('Name is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    ),
  pointOfContactEmail: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required('Email is required'),
  pointOfContactPhoneNumber: Yup.string().required('Phone is required'),
  zipCode: Yup.string().length(5, 'Should be 5 digits'),
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
  name: Yup.string().required("Operator's name is required"),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  pointOfContactEmail: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required('Email is required'),

  pointOfContactPhoneNumber: Yup.string().required('Phone is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), ''], "Passwords don't match"),
  state: Yup.string().required(),
  city: Yup.string().required(),
  street: Yup.string().required(),
  phone: Yup.string().required().required("Operator's phone is required"),
  email: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required("Operator's email is required"),
})

export const finishCreateOperatorFormData: IFinishCreatingOperator = {
  ...operatorInitialFormData,
  confirmPassword: '',
  password: '',
}

