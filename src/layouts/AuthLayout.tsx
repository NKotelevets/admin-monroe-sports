import styled from '@emotion/styled'
import { Flex } from 'antd'
import { FC, ReactNode } from 'react'

import AuthLayoutImage from '@/assets/images/MonroeSports.webp'

const StyledImage = styled.img`
  height: 100vh;
  width: 60vw;
  display: block;
  object-fit: fill;
`

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Flex vertical={false}>
    <div>
      <StyledImage src={AuthLayoutImage} alt="layout image" />
    </div>

    {children}
  </Flex>
)

export default AuthLayout
