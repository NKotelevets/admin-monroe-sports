import ConfigProvider from 'antd/es/config-provider'
import { FC, ReactNode } from 'react'

const DesignConfigProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#BC261B',
        colorPrimaryHover: '#F44034',
        colorPrimaryActive: '#BC261B',
        colorTextDisabled: '#888791',
        borderRadius: 0,
        fontFamily: 'Inter, sans-serif',
      },
    }}
  >
    {children}
  </ConfigProvider>
)

export default DesignConfigProvider
