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
        fontFamily: 'Inter, sans-serif',
        colorError: colors.primary
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
        },
        Button: {
          borderRadius: 2
        },
        Tooltip: {
          borderRadius: 2,
          colorBgSpotlight: 'rgba(62, 62, 72, 0.75)'
        }
      }
    }}
  >
    {children}
  </ConfigProvider>
)

export default DesignConfigProvider
