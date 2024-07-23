import { Flex } from 'antd'
import { FC, ReactNode } from 'react'

import AuthLayoutImage from '@/assets/images/MonroeSports.webp'

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Flex vertical={false}>
    <div>
      <img
        src={AuthLayoutImage}
        alt="layout image"
        style={{
          height: '100vh',
          width: '60vw',
          display: 'block',
          objectFit: 'fill',
        }}
      />
    </div>

    {children}
  </Flex>
)

export default AuthLayout
