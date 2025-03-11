import { Dayjs } from 'dayjs'

import { IInvite } from '@/common/interfaces/user.ts'

export type TChildFlowForm = {
  email: string
}

export type TSendInvitePayload = {
  inviteType: number
  teamId?: string
  emails: string[]
  childrenIds: string[]
}

export type TInviteProps = {
  invite?: IInvite
  callback?: () => void
  accepted?: boolean
  autoAccept?: boolean
}

export type TCreateSupervisedUserForm = {
  firstName: string
  lastName: string
  email?: string
  dateOfBirth: Dayjs | string | null
  zipCode: string
  photoS3Url: File | null
}

export type TCreateSupervisedUserPayload = {
  email?: string
  phoneNumber?: string
  password?: string
  additionalEmails?: { email: string }[]
  additionalPhones?: { phoneNumber: string }[]
  systemRole: number
  photoS3Url?: string
  firstName: string
  lastName: string
  birthDate: string
  gender?: 0
  zipCode: string
  city?: string
  state?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
}

export type TCreateSupervisedUserResponse = {
  id: string
  email: string
  phoneNumber: string | null
  asCoach: unknown | null
  asPlayer: unknown | null
  asHeadCoach: unknown[]
  asTeamAdmin: unknown | null
  additionalEmails: string[]
  additionalPhones: string[]
  phoneNumberVerified: boolean
  emailVerified: boolean
  inviteAccepted: string | null
  inviteDate: string | null
  operator: unknown | null
  roles: string[]
  teams: unknown[]
  isChild: boolean
  asSupervisor: unknown | null
  isSuperuser: boolean
  updatedAt: string
  createdAt: string
  systemRole: number
  photoS3Url: string | null
  firstName: string
  lastName: string
  birthDate: string
  gender: string | null
  zipCode: string
  city: string | null
  state: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  isActive: boolean
}
