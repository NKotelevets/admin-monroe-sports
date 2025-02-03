export type TSignUpForm = {
  email: string
  terms: boolean

  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  zipCode: string
  password: string
  confirmPassword: string
}
export type TSignUpResponse = {
  tokens: {
    refresh: string
    access: string
  }
  userId: string
  invitation: string
}
export type TSignUpResponseRaw = Omit<TSignUpResponse, 'userId'> & { user_id: string }
