import styled from '@emotion/styled'
import { Flex } from 'antd'
import { FC, ReactNode, RefObject, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MonroeTooltipContainer = styled.div`
  position: relative;
`

const MonroeTooltipContent = styled.div`
  position: absolute;
  top: 0%;
  left: 50%;
  padding: 8px;
  transform: translate(-50%, calc(-100% - 10px));
  background-color: #62636d;
  border-radius: 2px;
  font-size: 14px;
  z-index: 1;
  color: #fff;
  transform: translate(-50%, calc(-100% + -30px));

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

const MonroeTooltip: FC<IMonroeTooltipProps> = ({
  children,
  text,
  width,
  containerWidth = 'auto',
  height = 'auto',
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const ref = useRef<HTMLDivElement>()
  const boundingClientRect = ref.current?.getBoundingClientRect()
  const top = boundingClientRect && boundingClientRect.y + boundingClientRect?.height / 2 + 10
  const left = boundingClientRect && boundingClientRect.x + boundingClientRect?.width / 2 + 10

  return (
    <MonroeTooltipContainer
      style={{
        width: containerWidth,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
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

      <div ref={ref as RefObject<HTMLDivElement>} style={{ width: containerWidth }}>
        {children}
      </div>
    </MonroeTooltipContainer>
  )
}

export default MonroeTooltip
