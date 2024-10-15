import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import { FC } from 'react'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { IFENew } from '@/common/interfaces/user'
import { TGender } from '@/common/types'

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
  differences: Record<keyof IFENew, boolean>
}

const UsersDetailsColumn: FC<IUsersDetailsColumnProps> = ({
  isNew,
  title,
  birthDate,
  firstName,
  gender,
  lastName,
  phoneNumber,
  zipCode,
  email = '',
}) => (
  <Container is_new={`${isNew}`}>
    <Title>{title}</Title>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`false`}>First Name:</ItemTitle>
      <ItemValueStyle is_changed={`false`}>{firstName}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`false`}>Last Name:</ItemTitle>
      <ItemValueStyle is_changed={`false`}>{lastName}</ItemValueStyle>
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
      <ItemValueStyle is_changed={`false`}>{birthDate || '-'}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`false`}>Phone:</ItemTitle>
      <ItemValueStyle is_changed={`false`}>{phoneNumber}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`false`}>Zip Code:</ItemTitle>
      <ItemValueStyle is_changed={`false`}>{zipCode || '-'}</ItemValueStyle>
    </Flex>
  </Container>
)

export default UsersDetailsColumn
