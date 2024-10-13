import styled from '@emotion/styled'
import { Flex } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { ReactSVG } from 'react-svg'

import LogotypeIcon from '@/assets/icons/logotype.svg'

const StyledHeader = styled(Header)`
  height: 55px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f0ff;
  padding: 0 16px;
  width: 100vw;
`

const OperatorOnboardingHeader = () => (
  <StyledHeader>
    <Flex className="w-256" justify="center">
      <ReactSVG src={LogotypeIcon} />
    </Flex>
  </StyledHeader>
)

export default OperatorOnboardingHeader

