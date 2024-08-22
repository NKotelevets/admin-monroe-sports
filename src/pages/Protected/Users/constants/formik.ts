import * as Yup from 'yup'

import { ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES } from '@/pages/Protected/Users/constants/roles'

import { TRole } from '@/common/types'

const userRoleValidationSchema = Yup.object({
  name: Yup.string().required(),
  linkedEntities: Yup.array()
    .of(Yup.string())
    .when('name', {
      is: (value: string) => ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(value as TRole),
      then: (schema) => schema.required().min(1),
    }),
})

export const userValidationSchema = Yup.object<ICreateUserFormValues>().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  birthDate: Yup.string().nullable(),
  gender: Yup.string(),
  email: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required(),
  phoneNumber: Yup.string(),
  zipCode: Yup.string(),
  roles: Yup.array().of(userRoleValidationSchema),
})

export const INITIAL_ROLE_DATA = {
  name: '',
  linkedEntities: [],
}

export interface IRole {
  name: TRole | string
  linkedEntities?: string[]
}

export const userInitialFormData: ICreateUserFormValues = {
  firstName: '',
  lastName: '',
  birthDate: null,
  gender: undefined,
  email: '',
  phoneNumber: '',
  zipCode: '',
  roles: [
    {
      name: '',
      linkedEntities: [],
    },
  ],
}

export interface ICreateUserFormValues {
  firstName: string
  lastName: string
  birthDate: string | null
  gender: string | undefined
  email: string
  phoneNumber: string
  zipCode: string
  roles: IRole[]
}

