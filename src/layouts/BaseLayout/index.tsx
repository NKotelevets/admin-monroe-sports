import styled from '@emotion/styled'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { FC, ReactNode } from 'react'

import MonroeHeader from '@/layouts/BaseLayout/components/MonroeHeader'
import MonroeSidebar from '@/layouts/BaseLayout/components/MonroeSidebar'

import './styles.css'

const StyledLayout = styled(Layout)`
  overflow: hidden;
  width: 100vw;
  height: 100vh;
`

const StyledContent = styled(Content)`
  min-height: 120px;
  background-color: #f4f4f5;
`

const BaseLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <StyledLayout>
    <MonroeHeader />
    <Layout>
      <MonroeSidebar />
      <StyledContent>{children}</StyledContent>
    </Layout>
  </StyledLayout>
)

export default BaseLayout
