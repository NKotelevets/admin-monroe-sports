import styled from '@emotion/styled'
import Tooltip from 'antd/es/tooltip'
import Typography from 'antd/es/typography'
import { FC } from 'react'

const StyledTypography = styled(Typography)<{ is_regular_text: string }>`
  color: ${(props) => (props.is_regular_text === 'true' ? 'rgba(26, 22, 87, 0.85)' : '#3E34CA')};
  cursor: ${(props) => (props.is_regular_text === 'true' ? 'default' : 'pointer')};

  @media (width > 1660px) {
    font-size: 16px;
  }
`

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
        <StyledTypography is_regular_text={`${isRegularText}`} onClick={onClick}>
          {text.substring(0, maxLength - 3).trim() + '...'}
        </StyledTypography>
      </Tooltip>
    ) : (
      <StyledTypography is_regular_text={`${isRegularText}`} onClick={onClick}>
        {text}
      </StyledTypography>
    )}
  </>
)

export default TextWithTooltip
