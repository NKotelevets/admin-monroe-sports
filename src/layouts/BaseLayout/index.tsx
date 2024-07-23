import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { CSSProperties, FC, ReactNode } from 'react'

import MonroeHeader from '@/layouts/BaseLayout/components/MonroeHeader'
import MonroeSidebar from '@/layouts/BaseLayout/components/MonroeSidebar'

import './styles.css'

const layoutStyle: CSSProperties = {
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
}

const contentStyle: CSSProperties = {
  minHeight: 120,
  backgroundColor: '#F4F4F5',
}

const BaseLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Layout style={layoutStyle}>
    <MonroeHeader />
    <Layout>
      <MonroeSidebar />
      <Content style={contentStyle}>{children}</Content>
    </Layout>
  </Layout>
)

export default BaseLayout

