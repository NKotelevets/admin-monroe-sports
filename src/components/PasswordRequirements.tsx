import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Flex } from 'antd'
import { useEffect, useState } from 'react'

import { colors } from '@/utils/colors.tsx'

export const PasswordRequirements = (props: { password: string }) => {
  const { password } = props

  const [passwordStrength, setPasswordStrength] = useState<string>('weak')
  const [hasPasswordRequirements, setHasPasswordRequirements] = useState<string[]>([])

  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password))
    setHasPasswordRequirements(passwordRequirements(password))
  }, [password])

  return (
    <Body vertical>
      <Flex>
        <Title>Password requirements: {passwordStrength}</Title>
      </Flex>
      <Flex vertical>
        <Requirement>
          {hasPasswordRequirements.includes('long') ? <CheckIcon /> : <CloseIcon />}
          <Text>at least 8 characters</Text>
        </Requirement>
        <Requirement>
          {hasPasswordRequirements.includes('lowercase') ? <CheckIcon /> : <CloseIcon />}
          <Text>at least one lowercase letter</Text>
        </Requirement>
        <Requirement>
          {hasPasswordRequirements.includes('uppercase') ? <CheckIcon /> : <CloseIcon />}
          <Text>at least one uppercase letter</Text>
        </Requirement>
        <Requirement>
          {hasPasswordRequirements.includes('special') ? <CheckIcon /> : <CloseIcon />}
          <Text>at least one special character</Text>
        </Requirement>
        <Requirement>
          {hasPasswordRequirements.includes('numbers') ? <CheckIcon /> : <CloseIcon />}
          <Text>at least one digit</Text>
        </Requirement>
      </Flex>
    </Body>
  )
}

function passwordRequirements(password: string) {
  const requirements = []
  // Check password length
  if (password.length > 8) requirements.push('long')
  // Contains lowercase
  if (/[a-z]/.test(password)) requirements.push('lowercase')
  // Contains uppercase
  if (/[A-Z]/.test(password)) requirements.push('uppercase')
  // Contains numbers
  if (/\d/.test(password)) requirements.push('numbers')
  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) requirements.push('special')

  return requirements
}

function evaluatePasswordStrength(password: string) {
  let score = 0

  if (!password) return 'weak'

  score = passwordRequirements(password).length

  switch (score) {
    case 0:
    case 1:
    case 2:
      return 'weak'
    case 4:
    case 3:
      return 'medium'
    case 5:
      return 'strong'
    default:
      return 'weak'
  }
}

const Body = styled(Flex)`
    margin-top: 17px;
    margin-bottom: 10px;
`
const Title = styled.p`
    font-size: 12px;
    font-weight: 600;
    color: #1d1e22;
    margin-bottom: 20px;
`
const Text = styled.p`
    font-size: 12px;
    font-weight: 400;
    color: #696163;
`
const CloseIcon = styled(CloseOutlined)`
    font-size: 12px;
    font-weight: 400;
    color: ${colors.primary};

    & svg {
        width: inherit;
    }
`
const CheckIcon = styled(CheckOutlined)`
    font-size: 12px;
    font-weight: 400;
    color: #135708;

    & svg {
        width: inherit
    }
`
const Requirement = styled(Flex)`
    align-items: center;
    gap: 5px;
    line-height: 1.6;
`
