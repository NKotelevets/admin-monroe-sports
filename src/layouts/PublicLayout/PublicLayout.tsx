import styled from '@emotion/styled'
import { Layout } from 'antd'
import React from 'react'
import { ReactSVG } from 'react-svg'
import LogotypeIcon from '@/assets/icons/logotype.svg'

const { Header, Content, Footer: FT } = Layout

export interface IPublicLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
  centered?: boolean
  inline?: boolean
}

const PublicLayout = (props: IPublicLayoutProps) => {
  const { showFooter, centered, children, inline } = props

  if (inline) {
    return children
  }

  return (
    <Page className="public-layout">
      <>
        <Nav>
          <Section>
            <ReactSVG src={LogotypeIcon} style={styles.logo} />
          </Section>
        </Nav>

        <Body centered={centered}>
          <Section centered={centered}>{children}</Section>
        </Body>
        {showFooter ? <Footer>Swift Schedule ©{new Date().getFullYear()}</Footer> : undefined}
      </>
    </Page>
  )
}

export default PublicLayout

const styles = {
  logo: {
    width: 140,
    fontSize: 140,
  },
}

// Styled Components
const Page = styled(Layout)`
  min-height: 530px;

  min-width: 280px;
  background: #fff;

  @media (min-height: 530px) {
    min-height: 100vh;
  }
    
  @media (min-width: 770px ) and (max-height: 680px) {
      min-height: 680px;
  }
`
const Body = styled(Content)<{ centered?: boolean }>`
  overflow: visible !important;
  max-width: 600px;
  width: 100%;
  margin: ${({ centered }) => (centered ? 40 : 180)}px auto 0;
  background: #fff;
  display: flex;
  justify-content: ${({ centered }) => (centered ? 'center' : 'flex-start')};
  align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};

  @media (max-width: 768px) {
    margin: ${({ centered }) => (centered ? 0 : 180)}px auto;
    padding: 0;
  }
`
const Nav = styled(Header)`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0 0;
    background: transparent;
    position: absolute;
`
const Section = styled(Header)<{ centered?: boolean }>`
    max-width: 1160px;
    width: 100%;
    margin: 0 auto;
    background: transparent;
    line-height: 0 !important;
    height: 100%;
    display: flex;
    justify-content: ${({ centered }) => (centered ? 'center' : 'flex-start')};
    align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};

    @media (max-width: 768px) {
        & svg {
            width: 95px;
        }

        padding: 0 22px;
    }
`
const Footer = styled(FT)`
  text-align: center;
  background: transparent;
`
