import { Flex } from 'antd'
import { FC, ReactNode, RefObject, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import './tooltip.styles.css'

interface IMonroeTooltipProps {
  text: ReactNode
  children: ReactNode
  width: string
  containerWidth?: string
  arrowPosition?: 'top' | 'bottom'
}

const MonroeTooltip: FC<IMonroeTooltipProps> = ({
  children,
  text,
  width,
  containerWidth = 'auto',
  arrowPosition = 'bottom',
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const ref = useRef<HTMLDivElement>()
  const boundingClientRect = ref.current?.getBoundingClientRect()
  const top = boundingClientRect && boundingClientRect.y + boundingClientRect?.height / 2 + 10
  const left = boundingClientRect && boundingClientRect.x + boundingClientRect?.width / 2 + 10

  return (
    <>
      <Flex
        className={`tooltip ${arrowPosition}`}
        style={{
          width: containerWidth,
        }}
      >
        {showTooltip &&
          createPortal(
            <Flex
              className={`tooltip-content ${arrowPosition}`}
              style={{
                width,
                top,
                left,
                transform:
                  arrowPosition === 'bottom' ? 'translate(-50%, calc(-100% + -30px))' : 'translate(-50%, 0, 30px)',
              }}
            >
              {text}
            </Flex>,
            document.body,
          )}

        <div
          ref={ref as RefObject<HTMLDivElement>}
          style={{ width: containerWidth }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {children}
        </div>
      </Flex>
    </>
  )
}

export default MonroeTooltip
