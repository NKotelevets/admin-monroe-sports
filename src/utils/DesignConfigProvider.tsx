import ConfigProvider from 'antd/es/config-provider'
import { FC, ReactNode } from 'react'
import { colors } from './colors'

const DesignConfigProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: colors.primary,
        colorPrimaryHover: colors.primaryHover,
        colorPrimaryActive: colors.primary,
        colorTextDisabled: colors.dim,
        borderRadius: 0,
        fontFamily: 'Inter, sans-serif'
      },
      components: {
        Tabs: {
          inkBarColor: colors.secondary,
          itemSelectedColor: colors.secondary,
          itemHoverColor: colors.secondary,
          itemActiveColor: colors.secondary
        },
        Select: {
          activeBorderColor: colors.dim,
          activeOutlineColor: colors.transparent,
          hoverBorderColor: colors.dim,
          colorText: colors.secondaryText
        }
      }
    }}
  >
    {children}
  </ConfigProvider>
)

export default DesignConfigProvider
