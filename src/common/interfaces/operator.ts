export interface IBEOperator {
  id: string
  name: string
  email: string
  phone_number: string
  zip_code: string
  state: string
  city: string
  street: string
  first_name: string
  last_name: string
  phone_number_contact: string
  email_contact: string
}

export interface IFEOperator {
  id: string
  name: string
  email: string
  phoneNumber: string
  zipCode: string
  state: string
  city: string
  street: string
  firstName: string
  lastName: string
  phoneNumberContact: string
  emailContact: string
}

export interface IGetOperatorRequestParams {
  limit: number
  offset: number
  search?: string
}
