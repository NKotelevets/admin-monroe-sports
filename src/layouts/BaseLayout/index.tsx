import styled from '@emotion/styled'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { ReactElement, ReactNode } from 'react'

import MonroeHeader from '@/layouts/BaseLayout/components/MonroeHeader'
import MonroeSidebar from '@/layouts/BaseLayout/components/MonroeSidebar'

import './styles.css'

type BaseLayoutProps = {
  children: ReactNode
}

/**
 * BaseLayout is a functional component that provides the foundational
 * structure of the application, including header, sidebar, and main content area.
 *
 * @function
 * @param {BaseLayoutProps} props - The properties object.
 * @param {React.ReactNode} props.children - Elements or components to render within the layout's main content area.
 * @returns {ReactElement} The rendered BaseLayout component.
 */
const BaseLayout = ({ children }: BaseLayoutProps): ReactElement => (
  <LayoutStyled>
    <MonroeHeader />
    <Layout>
      <Body>
        <MonroeSidebar />
        <ContentStyled>{children}</ContentStyled>
      </Body>
    </Layout>
  </LayoutStyled>
)

export default BaseLayout

// Styled Components
const LayoutStyled = styled(Layout)`
  overflow: hidden;
  width: 100vw;
  height: 100vh;
`
const Body = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
`
const ContentStyled = styled(Content)`
  min-height: 120px;
  background-color: #f4f4f5;
  width: 100%;
  flex: 1;
`
