export interface IBEUser {
  id: string
  email: string
  gender: number
  city: string
  state: string
  phone_number: string
  phone_number_verified: boolean
  email_verified: boolean
  invite_accepted: string
  invite_date: string
  updated_at: string
  created_at: string
  photo_s3_url: string
  first_name: string
  last_name: string
  birth_date: string
  zip_code: string
  emergency_contact_name: string
  emergency_contact_phone: string
}

export interface IFEUser {
  id: string
  email: string
  gender: number
  city: string
  state: string
  phoneNumber: string
  phoneNumberVerified: boolean
  emailVerified: boolean
  inviteAccepted: string
  inviteDate: string
  updatedAt: string
  createdAt: string
  photoS3Url: string
  firstName: string
  lastName: string
  birthDate: string
  zipCode: string
  emergencyContactName: string
  emergencyContactPhone: string
  roles: {
    name: string
    linkedEntities: string[]
  }[]
}
