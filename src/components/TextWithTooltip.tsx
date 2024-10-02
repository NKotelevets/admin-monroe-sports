import Tooltip from 'antd/es/tooltip'
import Typography from 'antd/es/typography'
import { CSSProperties, FC } from 'react'

const textStyles: CSSProperties = {
  color: '#3E34CA',
  cursor: 'pointer',
}

const regularTextStyles = {
  color: 'rgba(26, 22, 87, 0.85)',
}

interface ITitleWithTooltipProps {
  maxLength: number
  text: string
  onClick?: () => void
  isRegularText?: boolean
}

const TextWithTooltip: FC<ITitleWithTooltipProps> = ({ maxLength, text, onClick, isRegularText }) => (
  <>
    {text?.length > maxLength ? (
      <Tooltip
        title={text}
        placement="top"
        color="rgba(62, 62, 72, 0.75)"
        style={{
          width: '250px',
        }}
      >
        <Typography.Text style={!isRegularText ? textStyles : regularTextStyles} onClick={onClick}>
          {text.substring(0, maxLength - 3).trim() + '...'}
        </Typography.Text>
      </Tooltip>
    ) : (
      <Typography.Text style={!isRegularText ? textStyles : regularTextStyles} onClick={onClick}>
        {text}
      </Typography.Text>
    )}
  </>
)

export default TextWithTooltip
