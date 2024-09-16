import styled from '@emotion/styled'
import { Flex } from 'antd'
import { FC, ReactNode, RefObject, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MonroeTooltipContainer = styled.div`
  position: relative;
`

const MonroeTooltipContent = styled.div`
  position: absolute;
  padding: 8px;
  background-color: #62636d;
  border-radius: 2px;
  font-size: 14px;
  color: #fff;
  z-index: 9999;
  top: 0%;
  left: 50%;
  transform: translate(-50%, calc(-100% - 5px));

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(0);
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
  const boundingClientRect = ref.current?.getBoundingClientRect()
  const top = boundingClientRect && boundingClientRect.y + boundingClientRect?.height / 2 - 10
  const left = boundingClientRect && boundingClientRect.x + boundingClientRect?.width / 2

  return (
    <MonroeTooltipContainer
      ref={ref as RefObject<HTMLDivElement>}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        width: containerWidth,
      }}
    >
      {showTooltip &&
        text &&
        createPortal(
          <MonroeTooltipContent
            style={{
              width,
              top,
              left,
            }}
          >
            <Flex
              style={{
                maxHeight: height,
                overflow: 'auto',
                paddingRight: '4px',
              }}
            >
              {text}
            </Flex>
          </MonroeTooltipContent>,
          document.body,
        )}

      {children}
    </MonroeTooltipContainer>
  )
}

export default MonroeTooltip
