import styled from '@emotion/styled'
import Flex from 'antd/es/flex'
import Typography from 'antd/es/typography'
import { ReactSVG } from 'react-svg'

import PrizeIcon from '@/assets/icons/prize.svg'

const WinnerText = styled(Typography)`
  color: rgba(26, 22, 87, 0.85);
  font-size: 14px;
  margin-left: 6px;
`

const WinnerContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  width: 180px;
  background-color: white;
  height: 43px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(calc(-50% + 10px));

  &::before {
    content: '';
    width: 76px;
    height: 2px;
    background-color: #d9d9d9;
    z-index: 9999;
    display: block;
    transform: translate(-100%, 0);
    position: absolute;
    top: 50%;
    left: 0;
  }
`

const EmptySpace = styled.div`
  width: 200px;
`

const WinnerWrapper = styled.div`
  position: relative;
`

const WinnerBox = () => (
  <WinnerWrapper>
    <EmptySpace />
    <WinnerContainer>
      <ReactSVG src={PrizeIcon} />
      <WinnerText>Winner</WinnerText>
    </WinnerContainer>
  </WinnerWrapper>
)
export default WinnerBox

