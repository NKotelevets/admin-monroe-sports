import { Flex } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { CSSProperties } from 'react'
import { ReactSVG } from 'react-svg'

import LogotypeIcon from '@/assets/icons/logotype.svg'

const headerStyle: CSSProperties = {
  height: 55,
  backgroundColor: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid  #F1F0FF',
  padding: '0 16px',
  width: '100vw',
}

const OperatorOnboardingHeader = () => (
  <Header style={headerStyle}>
    <Flex vertical={false} style={{ width: '256px' }} justify="center">
      <ReactSVG src={LogotypeIcon} />
    </Flex>
  </Header>
)

export default OperatorOnboardingHeader

