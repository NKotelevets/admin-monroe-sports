import Tooltip from 'antd/es/tooltip'
import Typography from 'antd/es/typography'
import { CSSProperties, FC } from 'react'

const textStyles: CSSProperties = {
  color: '#3E34CA',
  cursor: 'pointer',
  zIndex: 9999,
}

interface ITitleWithTooltipProps {
  maxLength: number
  text: string
  onClick?: () => void
}

const TextWithTooltip: FC<ITitleWithTooltipProps> = ({ maxLength, text, onClick }) => (
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
        <Typography.Text style={textStyles} onClick={onClick}>
          {text.substring(0, maxLength - 3).trim() + '...'}
        </Typography.Text>
      </Tooltip>
    ) : (
      <Typography.Text style={textStyles} onClick={onClick}>
        {text}
      </Typography.Text>
    )}
  </>
)

export default TextWithTooltip

