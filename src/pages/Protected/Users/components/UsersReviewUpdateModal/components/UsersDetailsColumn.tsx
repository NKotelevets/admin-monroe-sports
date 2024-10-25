import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import { FC, useCallback } from 'react'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { IAsEntity, IChildren, IExtendedFEUser, IFENew, IOperator } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'
import { IIdName } from '@/common/interfaces'
import { formatPhoneNumber } from '@/utils'

const Container = styled(Flex)<{ is_new: string }>`
  flex: 1 1 50%;
  flex-direction: column;
  border-right: ${(props) => (props.is_new === 'true' ? '0' : '2px solid #F4F4F5')};
  padding-left: ${(props) => (props.is_new !== 'true' ? '0' : '16px')};
  padding-right: ${(props) => (props.is_new !== 'true' ? '16px' : '0')};
`

const Title = styled(Typography)`
  color: #888791;
  font-size: 14px;
  margin-bottom: 8px;
`

const ItemTitle = styled(Typography)<{ is_changed: string }>`
  margin-bottom: 4px;
  margin-right: 20px;
  color: ${({ is_changed }) => (is_changed === 'true' ? 'rgba(26, 22, 87, 0.85)' : '#888791')};
  font-weight: 500;
`

const ItemValueStyle = styled(Typography)<{ is_changed: string }>`
  color: ${({ is_changed }) => (is_changed === 'true' ? '#333' : '#888791')};
`

interface IUsersDetailsColumnProps extends IFENew {
  title: string
  isNew: boolean
  // Since we have to show current roles at the same column
  // as imported data, we need to pass current user data to use when isNew is true
  current?: IExtendedFEUser
  differences: Record<keyof IFENew, boolean>
}

type TUsersDetailsColumnProps = {
  asCoach?: IAsEntity | null
  asPlayer?: IAsEntity | null
  operator?: IOperator | null
  asHeadCoach?: IIdName[] | null
  asTeamAdmin?: IIdName[] | null
  birthDateFormatted?: string
  isChild?: boolean
  asParent?: null | IChildren[]
} & IUsersDetailsColumnProps

type RoleTeamsMap = Record<TRole | 'Parent', IIdName[] | IOperator | IChildren[] | null>;

const UsersDetailsColumn: FC<TUsersDetailsColumnProps> = ({
  isNew,
  title,
  birthDateFormatted,
  firstName,
  gender= 2,
  lastName,
  phoneNumber,
  zipCode,
  email = '',
  roles,
  teams,
  current,
  differences,
  asPlayer = null,
  asCoach = null,
  asParent = null,
  asHeadCoach = null,
  operator = null,
  asTeamAdmin = null,
}) => {
  const currentRoles = isNew ? current?.roles : roles

  const teamsAsText = useCallback((role: TRole | 'Parent'): string | null => {
    const roleTeamsMap: RoleTeamsMap = {
      'Coach': current?.asCoach?.teams || asCoach?.teams || null,
      'Player': current?.asPlayer?.teams || asPlayer?.teams || null,
      'Head Coach': current?.asHeadCoach || asHeadCoach,
      'Team Admin': current?.asTeamAdmin || asTeamAdmin,
      'Master Admin': null,
      'Operator': current?.operator || operator ,
      'Parent': current?.asParent || asParent
    }

    const teamsOrOperator = roleTeamsMap[role]

    if (Array.isArray(teamsOrOperator)) {
      if (role === 'Parent') {
        const parents = teamsOrOperator as IChildren[]
        return parents.map((parent) => `${parent.firstName} ${parent.lastName}`).join(', ')
      }

      return (teamsOrOperator as IIdName[]).map((team) => team.name).join(', ')
    }

    if (teamsOrOperator && 'name' in teamsOrOperator) {
      return teamsOrOperator.name
    }

    // Return undefined if there are no teams or operator
    return null
  }, [asCoach, asPlayer, asHeadCoach, asTeamAdmin, operator, asParent, current])

  return (
    <Container is_new={`${isNew}`}>
      <Title>{title}</Title>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Name:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{firstName} {lastName}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Gender:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{gender ? FULL_GENDER_NAMES[gender as TGender] : '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Email:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{email || '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Birth Date:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{birthDateFormatted}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Phone:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{phoneNumber ? formatPhoneNumber(phoneNumber) : '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Zip Code:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{zipCode || '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Current Roles:</ItemTitle>
        {!currentRoles?.length && (
          <ItemValueStyle is_changed={`false`}>-</ItemValueStyle>
        )}
        {currentRoles?.map(role => (
          <ItemValueStyle key={`${role}-key`} is_changed={`false`}>{role}: {teamsAsText(role as TRole)};</ItemValueStyle>
        ))}
      </Flex>

      {isNew && current && differences.roles && (
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${isNew}`}>New Roles:</ItemTitle>
          {roles?.map((role, index) => (
            <ItemValueStyle key={`new-${role}-key`} is_changed={`${isNew}`}>{role}: {teams[index]};</ItemValueStyle>
          ))}
        </Flex>
      )}
    </Container>
  )
}

export default UsersDetailsColumn
