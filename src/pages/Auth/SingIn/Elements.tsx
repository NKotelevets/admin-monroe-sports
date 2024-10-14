import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'

import MonroeButton from '@/components/MonroeButton'

export const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  width: 400px;

  @media (width > 1660px) {
    width: 100%;
    min-width: 600px;
  }
`

export const Title = styled.h1`
  color: #1a1657;
  font-size: 30px;
  font-weight: 500;
  margin: 0;

  @media (width > 1660px) {
    font-size: 44px;
  }
`

export const Subtitle = styled(Typography)`
  color: rgba(26, 22, 87, 0.85);
  font-size: 14px;
  font-weight: 400;
  margin: 0;

  @media (width > 1660px) {
    font-size: 30px;
  }
`

export const CheckboxText = styled(Typography)`
  color: rgba(26, 22, 87, 0.85);
  margin-left: 8px;

  @media (width > 1660px) {
    font-size: 22px;
  }
`

export const SignInButton = styled(MonroeButton)`
  height: 40px;

  @media (width > 1660px) {
    font-size: 24px;
    height: 60px;
  }
`

export const ForgotPasswordWrapper = styled(Typography)`
  color: #3e34ca;
  margin-top: 5px;

  @media (width > 1660px) {
    font-size: 18px;
  }
`
