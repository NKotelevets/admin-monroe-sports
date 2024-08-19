import styled from '@emotion/styled'
import { Flex } from 'antd'
import { FC, ReactNode, RefObject, useRef, useState } from 'react'

const MonroeTooltipContainer = styled.div`
  position: relative;
`

const MonroeTooltipContent = styled.div`
  position: absolute;
  top: 0%;
  left: 50%;
  padding: 8px;
  transform: translate(-50%, calc(-100% - 5px));
  background-color: #62636d;
  border-radius: 2px;
  font-size: 14px;
  color: #fff;
  z-index: 9999;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #62636d;
  }
`

interface IMonroeTooltipProps {
  text: ReactNode
  children: ReactNode
  width: string
  containerWidth?: string
  height?: string
}

const MonroeTooltip: FC<IMonroeTooltipProps> = ({ children, text, width, height = 'auto', containerWidth }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const ref = useRef<HTMLDivElement>()

  return (
    <MonroeTooltipContainer
      ref={ref as RefObject<HTMLDivElement>}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        width: containerWidth,
      }}
    >
      {showTooltip && text && (
        <MonroeTooltipContent style={{ width }}>
          <Flex
            style={{
              maxHeight: height,
              overflow: 'auto',
              paddingRight: '4px',
            }}
          >
            {text}
          </Flex>
        </MonroeTooltipContent>
      )}

      {children}
    </MonroeTooltipContainer>
  )
}

export default MonroeTooltip
