import { IAdditionalEmail, IAdditionalPhone } from '@/common/interfaces'
import { IBEOperator } from '@/common/interfaces/operator'

export interface ISignInResponse {
  access: string
  refresh: string
}

export interface ISignInRequestBody {
  email: string
  password: string
  isStaySignIn: boolean
}

interface IUserData {
  id: string
  email: string
  phone_number: string
  additional_emails: IAdditionalEmail[]
  additional_phones: IAdditionalPhone[]
  phone_number_verified: boolean
  email_verified: boolean
  invite_accepted: string
  invite_date: string
  operator: IBEOperator
  is_superuser: boolean
  updated_at: string
  created_at: string
  system_role: number
  photo_s3_url: string
  first_name: string
  last_name: string
  birth_date: string
  gender: number
  zip_code: string
  city: string
  state: string
  emergency_contact_name: string
  emergency_contact_phone: string
  is_active: boolean
}

export interface IPrefilledData {
  user_data: IUserData
  invitation: {
    id: string
  }
}

export interface ICreateUserBody {
  email: string
  phone_number: string
  password: string
  first_name: string
  last_name: string
}

export interface IUpdateOperator {
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
